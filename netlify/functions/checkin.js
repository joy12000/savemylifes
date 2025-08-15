// netlify/functions/checkin.js
const { getStore } = require('@netlify/blobs')
const jose = require('jose')

async function verifyAuth0(req) {
  const auth = req.headers['authorization'] || ''
  if (!auth.startsWith('Bearer ')) return { ok: true, sub: 'dev' } // 개발모드 허용
  const token = auth.slice('Bearer '.length)

  const domain = process.env.AUTH0_DOMAIN || process.env.VITE_AUTH0_DOMAIN
  const audience = process.env.AUTH0_AUDIENCE || process.env.VITE_AUTH0_AUDIENCE || undefined
  const clientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || process.env.AUTH0_CLIENT_ID
  if (!domain || !(audience || clientId)) return { ok: true, sub: 'dev' }

  try {
    const JWKS = jose.createRemoteJWKSet(new URL(`https://${domain}/.well-known/jwks.json`))
    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: `https://${domain}/`,
      audience: audience || clientId,
    })
    return { ok: true, sub: payload.sub || 'user', name: payload.name || '' }
  } catch (e) {
    return { ok: false, error: e?.message || String(e) }
  }
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  const auth = await verifyAuth0(event)
  if (!auth.ok) return { statusCode: 401, body: 'Unauthorized: ' + auth.error }

  const now = new Date()
  const date = new Date(now.getTime() - now.getTimezoneOffset()*60000).toISOString().slice(0,10) // YYYY-MM-DD in local-ish
  const sub = auth.sub
  const store = getStore('keepalive')

  const byUserKey = `checkins/${date}/${sub}.json`
  const exists = await store.get(byUserKey, { type: 'json' })
  if (exists) {
    return { statusCode: 200, headers: { 'content-type':'application/json' }, body: JSON.stringify({ ok: true, already: true, ts: exists.ts }) }
  }

  const payload = { ts: Date.now(), date, sub }
  await store.set(byUserKey, JSON.stringify(payload), { contentType: 'application/json; charset=utf-8' })
  await store.set(`checkins/latest/${sub}.json`, JSON.stringify(payload), { contentType: 'application/json; charset=utf-8' })

  return { statusCode: 200, headers: { 'content-type':'application/json' }, body: JSON.stringify({ ok: true, already: false, ts: payload.ts }) }
}
