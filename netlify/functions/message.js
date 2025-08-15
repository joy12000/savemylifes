// netlify/functions/message.js
const { getStore } = require('@netlify/blobs')
const { v4: uuid } = require('uuid')
const jose = require('jose')

async function verifyAuth0(req) {
  const auth = req.headers['authorization'] || ''
  if (!auth.startsWith('Bearer ')) return { ok: false, reason: 'no_token' }
  const token = auth.slice('Bearer '.length)

  const domain = process.env.AUTH0_DOMAIN
  const clientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || process.env.AUTH0_CLIENT_ID
  if (!domain || !clientId) {
    // 토큰 검증 비활성(개발 모드)
    return { ok: true, sub: 'dev' }
  }
  try {
    const JWKS = jose.createRemoteJWKSet(new URL(`https://${domain}/.well-known/jwks.json`))
    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: `https://${domain}/`,
      audience: clientId,
    })
    return { ok: true, sub: payload.sub }
  } catch (e) {
    return { ok: false, reason: 'invalid_token' }
  }
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  const auth = await verifyAuth0(event)
  if (!auth.ok) {
    return { statusCode: 401, body: 'Unauthorized: ' + auth.reason }
  }
  try {
    const body = JSON.parse(event.body || '{}')
    const room = body.room || 'default'
    const text = String(body.text || '').slice(0, 5000)
    const id = uuid()
    const ts = Date.now()

    const store = getStore('messages')
    const key = `rooms/${room}/messages/${id}.json`
    await store.set(key, JSON.stringify({ id, ts, text, room, by: auth.sub || 'dev' }), {
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
