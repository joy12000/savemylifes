// netlify/functions/message.js
const { getStore } = require('@netlify/blobs')
const { v4: uuid } = require('uuid')
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
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }

    const auth = await verifyAuth0(event)
    if (!auth.ok) return { statusCode: 401, body: 'Unauthorized: ' + auth.error }

    const body = JSON.parse(event.body || '{}')
    const room = (body.room || 'default').replace(/[^a-zA-Z0-9_-]/g, '')
    const text = (body.text || '').toString().slice(0, 2000)
    const meta = body.meta || null

    const store = getStore('messages')

    const id = uuid()
    const ts = Date.now()
    const key = `rooms/${room}/messages/${ts}-${id}.json`
    const payload = { id, ts, text, room, by: auth.sub || 'dev', ...(meta ? { meta } : {}) }
    await store.set(key, JSON.stringify(payload), {
      contentType: 'application/json; charset=utf-8',
    })

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ok: true, id, ts }),
    }
  } catch (e) {
    return { statusCode: 500, body: 'Server Error: ' + (e.message || e) }
  }
}
