

const jose = require('jose')
exports.verifyAuth = async function(event) {
  const domain = process.env.AUTH0_DOMAIN
  const clientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || process.env.AUTH0_CLIENT_ID
  const audience = process.env.AUTH0_AUDIENCE || clientId
  if (!domain || !clientId) return null
  const auth = event.headers['authorization'] || ''
  if (!auth.startsWith('Bearer ')) throw new Error('No token')
  const token = auth.slice('Bearer '.length)
  const JWKS = jose.createRemoteJWKSet(new URL(`https://${domain}/.well-known/jwks.json`))
  const { payload } = await jose.jwtVerify(token, JWKS, { issuer: `https://${domain}/`, audience })
  return { sub: payload.sub, name: payload.name || '' }
}
