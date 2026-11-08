---
title: Custom Storage
parent: Server Owners
nav_order: 5.5
description: "Store GFX Phone photos, videos and voice messages on your own upload service instead of Fivemanage: settings, the signed upload link, CORS, a ready-made Cloudflare Worker and hosting without a domain."
---

# Custom Storage
{: .no_toc }

By default the phone keeps photos, videos and voice messages on your Fivemanage account. The
**custom** provider sends them to your own upload service instead: an S3 / R2 bucket behind a small
Worker, a Node, Python or PHP uploader, anything that takes a file over https and answers with a
link.

1. TOC
{:toc}

---

## Settings

Admin panel > **Configuration > Media storage**, or step 5 of the [setup wizard](setup-wizard.md).
Set **Storage provider** to `custom`:

| Panel setting | Config path | Default | |
|---|---|---|---|
| Upload URL | `Media.Custom.UploadUrl` | - | Full https address the files are posted to. May carry a query and a port |
| File field | `Media.Custom.FileField` | `file` | Name of the form field that carries the file |
| Link path in the answer | `Media.Custom.UrlPath` | `url` | Where the link is in the JSON answer: `url`, `data.url`, `files.0.url` |
| Signing key | `Media.CustomKey` | - | Shared secret your service checks. Panel only, kept on the server, never sent to players |

**Test upload** posts one transparent pixel (to `gfx-phone/test`) from the server and reads the link
back, so a wrong address, key, field or link path shows there and not on a player's camera. That
file stays on your storage.

## What your service has to do

### 1. Take a multipart POST

The phone sends `POST` with `multipart/form-data`. The form holds the file (in the **File field**,
with a file name and content type) and three text fields you may ignore:

| Field | |
|---|---|
| `path` | Suggested folder: `gfx-phone/photos`, `/videos`, `/voicemail`, `/sounds`, `/pictures`... |
| `retention_exempt` | `true`: a player's file, an automatic clean-up should leave it |
| `metadata` | Small JSON, for example `{"app":"camera"}` |

### 2. Answer with the file's link

Answer with a `2xx` status and JSON that holds the file's public https link at the **Link path**:

```json
{ "url": "https://media.example.com/gfx-phone/photos/abc.webp" }
```

Other players' phones load that link directly, so it must be public and must **never expire or
change**: the phone stores the full link. Keep it under 2048 characters.

| Status | The phone reads it as |
|---|---|
| `2xx` + link | Uploaded |
| `401` / `403` | Wrong signing key |
| `413` | File too large |
| anything else | Upload failed |

### 3. Allow the game to read the answer (CORS)

The phone is a browser page on `https://cfx-nui-gfx-phone` (the resource's folder name), so every
upload is a cross-origin request. Without these headers the file may arrive but the phone never gets
the link:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: *
```

Answer `OPTIONS` with `204` and the same headers. A CDN in front must not cache or strip them.

### 4. Check the signed link

Players must never hold a key, so the server signs every upload. Players post to your **Upload URL**
plus four query values:

```
https://upload.example.com/?kind=image&expires=1794149735&nonce=41ca0e02d52cf1de4453572919165bbd&signature=4326c26d...
```

| Value | |
|---|---|
| `kind` | `image`, `video` or `audio`: cap the file size per kind |
| `expires` | Unix time in seconds. Refuse the upload after it |
| `nonce` | 32 hex characters, new for every link |
| `signature` | Hex HMAC-SHA256 of the text `<kind>.<expires>.<nonce>`, keyed with the **Signing key** |

If your Upload URL already has a query, the four values are added after it with `&`.

- Compare the signature in constant time.
- A link lives 2 minutes for a photo or sound, and the longest allowed clip plus 3 minutes for a
  video.
- The phone asks for a new link for every upload. Mark a nonce used once its file is stored (or name
  the file after the nonce), so one link cannot write twice.

**Node.js**

```js
const crypto = require('crypto')

function validLink(q, secret) {
  if (Number(q.expires) < Date.now() / 1000) return false
  const want = crypto.createHmac('sha256', secret).update(`${q.kind}.${q.expires}.${q.nonce}`).digest()
  const got = Buffer.from(String(q.signature), 'hex')
  return got.length === want.length && crypto.timingSafeEqual(got, want)
}
```

**Python**

```python
import hashlib, hmac, time

def valid_link(q, secret):
    expires = q.get('expires', '')
    if not expires.isdigit() or int(expires) < time.time():
        return False
    msg = f"{q.get('kind', '')}.{expires}.{q.get('nonce', '')}".encode()
    want = hmac.new(secret.encode(), msg, hashlib.sha256).hexdigest()
    return hmac.compare_digest(want, q.get('signature', ''))
```

**PHP**

```php
function valid_link(array $q, string $secret): bool {
    $expires = $q['expires'] ?? '';
    if (!ctype_digit($expires) || (int) $expires < time()) return false;
    $want = hash_hmac('sha256', ($q['kind'] ?? '') . '.' . $expires . '.' . ($q['nonce'] ?? ''), $secret);
    return hash_equals($want, (string) ($q['signature'] ?? ''));
}
```

{: .warning }
With the **Signing key** empty the phone posts to the plain Upload URL and nothing is signed: anyone
who sees the address (it is in every player's network traffic) can upload to it. Use that only for
a service that protects itself some other way.

A service that only knows one fixed API key cannot be used directly: that key would have to go to
every player. Put a small service in front of it that checks the signed link and forwards the file.

## Ready-made example: Cloudflare Worker + R2

[`examples/custom-upload/worker.js`](https://github.com/GFX-Fivem/gfx-phone-docs/blob/main/examples/custom-upload/worker.js)
is a complete upload service in about 90 lines: it checks the signed link, caps the size per kind,
allows one file per link, stores the file in an R2 bucket and serves it back (with range requests,
so videos and voice messages can seek). It runs on Cloudflare's free tier and needs **no domain, no
certificate and no server of your own**.

1. Create an R2 bucket named `gfx-phone` in your Cloudflare dashboard.
2. Put `worker.js` in a folder with this `wrangler.toml`:

   ```toml
   name = "gfx-phone-uploads"
   main = "worker.js"
   compatibility_date = "2025-09-01"

   [[r2_buckets]]
   binding = "BUCKET"
   bucket_name = "gfx-phone"
   ```

3. Run `npx wrangler secret put SIGNING_KEY` and enter a long random value, then
   `npx wrangler deploy`. Wrangler prints the Worker's address, for example
   `https://gfx-phone-uploads.<account>.workers.dev`.
4. In the panel: **Upload URL** = that address, **File field** = `file`, **Link path** = `url`,
   **Signing key** = the same value as `SIGNING_KEY`. Press **Test upload**.

The Worker answers with links on its own address. To serve the files from an R2 custom domain
instead, add `[vars]` with `PUBLIC_URL = "https://media.example.com"`.

## Hosting without a domain

The upload address and the file links must be **https**: the phone is an https page, and the
browser inside the game refuses to upload to or load pictures from a plain `http://` address. If
your service runs at home or on a machine without a domain or certificate:

- **Cloudflare Worker + R2** (above): nothing to host, the `workers.dev` address comes with https.
- **Tailscale Funnel**: publishes a local port at a fixed `https://<machine>.<tailnet>.ts.net`
  address with a certificate managed for you. No domain and no open port needed.
- **Cloudflare Tunnel**: a fixed address needs a domain on your Cloudflare account. The domain-less
  "quick tunnel" (`trycloudflare.com`) gets a new address on every restart, so it is not suitable.

Two things to keep in mind:

- **The address must never change.** Every stored photo, video and voice message keeps its full
  link. A new address breaks every file stored before.
- **Do not serve files straight from your home IP.** Every player's game downloads the files itself,
  so it would see your IP address and use your upload bandwidth. The three options above keep your
  IP hidden.

## What goes through it

- Every player upload (camera, voice messages, voicemail, stickers, avatars, screenshots) goes from
  the player's phone straight to your service, never through the game server.
- The server itself uploads a few files the same way: pictures from pasted links, panel app icons,
  Discord log icons and YouTube sound clips.
- Expect photos of up to a few MB and about 12 MB per minute of video (`Media.MaxVideoSeconds` sets
  the longest clip).
- Changing the provider later is safe: stored links keep working, nothing moves.
- The phone never deletes files from your storage: the same link may sit in someone's chat.

## Troubleshooting

| Test upload says | Check |
|---|---|
| The upload URL must be a full https address | `https://` + a host name, no spaces or `#` |
| The provider rejected this key (`401` / `403`) | The Signing key is the same in the panel and in your service; the server's clock is right (links expire) |
| ...there is no https link at the link path | The **Link path** matches your JSON (`url`, `data.url`...) and the link starts with `https://` |
| Your upload service refused the file | Your service's log: the field name, the size cap, the signature check |
| Could not reach the provider from the server | The address is public and reachable from the game server (firewall, DNS, certificate) |

Test upload works but uploads from players fail? Your service is missing the CORS headers or the
`204` answer to `OPTIONS` (step 3): the server's test does not need them, the players' phones do.
