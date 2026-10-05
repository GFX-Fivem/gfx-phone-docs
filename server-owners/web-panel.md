---
title: Web Admin Panel
parent: Server Owners
nav_order: 3
description: "Manage your FiveM phone from the browser: sign in to phone.gfxscripts.com, register your server, invite staff and rotate the secret."
---

# Web Admin Panel (phone.gfxscripts.com)
{: .no_toc }

The GFX Phone admin panel runs in your browser at **[phone.gfxscripts.com](https://phone.gfxscripts.com)**.
It is the same panel as the [in-game one](in-game-panel.md), reachable from anywhere - your phone
data stays in **your own** database and only passes through on its way to your browser.

1. TOC
{:toc}

---

## How it connects

Your game server connects **out** to phone.gfxscripts.com and keeps that link open. You do not open a
port, set up a domain or install a certificate; the server only needs outgoing HTTPS.

## Owner sign-in

1. Open [phone.gfxscripts.com](https://phone.gfxscripts.com).
2. Sign in with the **Tebex transaction id** of your GFX Phone purchase (`tbx-...`, or the long id of a
   manual payment).
3. The first time, claim the purchase with a **password** and/or **Discord**. Later, sign in with the
   transaction id + password, or Discord. Forgot the password? The reset link goes to the purchase's
   Tebex e-mail.

The dashboard lists your servers with their live status (online, version, players, setup pending).

## Register a server

1. **Register a server** > pick the purchase > give the server a name.
2. Copy the two lines the dashboard shows **once**:

   ```cfg
   set gfxphone_server_id "srv_..."
   set gfxphone_admin_secret "..."
   ```

3. Paste them into `server.cfg` above `ensure gfx-phone` and restart the resource.
4. The server goes from "waiting for first connection" to **online** within seconds.
5. **Open panel**.

Already activated the licence in game? Then the server is registered already - just sign in with the
same transaction id and it is on your dashboard.

## Staff accounts

Staff do not use your purchase. In the panel, open **Admins**, create an account for each staff
member with a role (viewer, manager or super - see [roles](in-game-panel.md#roles)), then send them the
server's **Staff link** (`https://phone.gfxscripts.com/?server=srv_...`). They sign in there with
their username + password or Discord.

## Rotate the secret

Leaked the secret, or a copy of your `server.cfg` runs somewhere else? **Rotate secret** on the
dashboard issues new lines and signs every panel session out. Put the new lines only on this server.

## Turning the web panel off

`Config.Admin.Web.Enabled = false` stops the server from connecting. The in-game panel keeps working.

## What you can do in the panel

- **Overview** - phone status, licence, players online, warnings.
- **Configuration** - every setting of the phone, live, no restart. See [Configuration](configuration.md).
- **Players and accounts** - look up any player's phone, lines, device and activity; read-only phone
  mirror; factory-reset one account.
- **Moderation and approvals** - posts, profiles and businesses waiting for review in the social and
  business apps.
- **Coverage map and Wi-Fi** - draw signal zones and hotspots on the map.
- **Languages** - add a language or change any text without touching files.
- **Import** - bring data from another phone script. See [Import](importing-from-another-phone.md).
- **Danger zone** (super) - wipe phone data.
