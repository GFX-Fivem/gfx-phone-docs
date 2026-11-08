/*
 * gfx-phone :: example upload service (Cloudflare Worker + R2), docs/custom-storage.md.
 *
 * What the phone needs from an upload service, in one file: check the signed link, keep the file,
 * answer with its public https link. Copy it, or write the same few steps in any language.
 *
 * wrangler.toml:
 *   name = "gfx-phone-uploads"
 *   main = "worker.js"
 *   compatibility_date = "2025-09-01"
 *   [[r2_buckets]]
 *   binding = "BUCKET"
 *   bucket_name = "gfx-phone"
 *   # Optional: the bucket's own public address (an R2 custom domain). Leave it out and the Worker
 *   # serves the files itself from its own https address (https://gfx-phone-uploads.<account>.workers.dev),
 *   # so no domain or certificate is needed.
 *   # [vars]
 *   # PUBLIC_URL = "https://media.example.com"
 *
 * Secret: `wrangler secret put SIGNING_KEY`, the same value as Signing key in the phone's panel.
 * Panel: Upload URL = this Worker's address, File field = file, Link path = url.
 */

// Biggest file per kind (bytes): a signed link can only be used for its own kind.
const MAX_BYTES = { image: 10 * 1024 * 1024, audio: 25 * 1024 * 1024, video: 200 * 1024 * 1024 }

// The phone is a browser page on https://cfx-nui-gfx-phone. Without these the game cannot read the answer.
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS', 'Access-Control-Allow-Headers': '*' }

const answer = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...CORS } })

async function validSignature(secret, kind, expires, nonce, signature) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
  const bytes = new Uint8Array((signature.match(/[0-9a-f]{2}/g) ?? []).map((b) => parseInt(b, 16)))
  return bytes.length === 32 && crypto.subtle.verify('HMAC', key, bytes, new TextEncoder().encode(`${kind}.${expires}.${nonce}`))
}

// A stored file, by its exact name (no listing). Range requests let videos and voice messages seek.
async function serve(request, env) {
  const key = new URL(request.url).pathname.slice(1)
  if (!/^\w[\w/.-]{0,199}$/.test(key)) return new Response('Not found', { status: 404, headers: CORS })
  const object = await env.BUCKET.get(key, { range: request.headers })
  if (!object) return new Response('Not found', { status: 404, headers: CORS })
  const headers = new Headers(CORS)
  object.writeHttpMetadata(headers)
  headers.set('ETag', object.httpEtag)
  headers.set('Accept-Ranges', 'bytes')
  headers.set('Cache-Control', 'public, max-age=31536000, immutable') // a name is never reused
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Content-Security-Policy', 'sandbox') // an uploaded page could never run as this address
  let status = 200
  const r = request.headers.has('Range') ? object.range : undefined
  if (r) {
    const offset = 'suffix' in r ? object.size - r.suffix : (r.offset ?? 0)
    const length = 'suffix' in r ? r.suffix : (r.length ?? object.size - offset)
    headers.set('Content-Range', `bytes ${offset}-${offset + length - 1}/${object.size}`)
    headers.set('Content-Length', String(length))
    status = 206
  }
  return new Response(request.method === 'HEAD' ? null : object.body, { status, headers })
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
    if (request.method === 'GET' || request.method === 'HEAD') return serve(request, env)
    if (request.method !== 'POST') return answer(405, { error: 'method' })

    const q = new URL(request.url).searchParams
    const kind = q.get('kind') ?? '', expires = q.get('expires') ?? '', nonce = q.get('nonce') ?? ''
    if (!MAX_BYTES[kind] || !/^\d+$/.test(expires) || !/^[0-9a-f]{32}$/.test(nonce)) return answer(401, { error: 'link' })
    if (Number(expires) < Date.now() / 1000) return answer(401, { error: 'expired' })
    if (!(await validSignature(env.SIGNING_KEY, kind, expires, nonce, q.get('signature') ?? ''))) return answer(401, { error: 'signature' })

    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File) || file.size === 0) return answer(400, { error: 'file' })
    if (file.size > MAX_BYTES[kind]) return answer(413, { error: 'tooLarge' })

    // One link writes one file: the nonce is marked used once its file is stored (the phone asks
    // for a new link for every upload). Markers live under `.used/`, a name no upload can take.
    if (await env.BUCKET.head(`.used/${nonce}`)) return answer(401, { error: 'used' })
    const name = String(file.name).replace(/[^\w.-]/g, '').slice(-64) || 'file'
    const folder = String(form.get('path') ?? '').replace(/[^\w/-]/g, '').replace(/^\/+|\/+$/g, '').slice(0, 64) || 'gfx-phone'
    const key = `${folder}/${nonce}-${name}`
    await env.BUCKET.put(key, file.stream(), { httpMetadata: { contentType: file.type || 'application/octet-stream' } })
    await env.BUCKET.put(`.used/${nonce}`, expires)
    return answer(200, { url: `${env.PUBLIC_URL || new URL(request.url).origin}/${key}` })
  },
}
