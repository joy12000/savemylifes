import { getStore } from "@netlify/blobs"
import * as jose from "jose"

export function blobs(name = "chat"){
  const siteID = process.env.BLOBS_SITE_ID || process.env.NETLIFY_SITE_ID || process.env.SITE_ID || process.env.API_ID
  const token  = process.env.BLOBS_TOKEN   || process.env.NETLIFY_ACCESS_TOKEN || process.env.NETLIFY_API_TOKEN || process.env.PERSONAL_ACCESS_TOKEN
  return (siteID && token) ? getStore({ name, siteID, token }) : getStore(name)
}

export async function verifyAuth0(idToken: string){
  const domain = process.env.AUTH0_DOMAIN || process.env.VITE_AUTH0_DOMAIN
  const issuer = `https://${domain}/`
  const JWKS = jose.createRemoteJWKSet(new URL(`${issuer}.well-known/jwks.json`))
  const { payload } = await jose.jwtVerify(idToken, JWKS, {
    issuer,
    audience: process.env.AUTH0_AUDIENCE || process.env.VITE_AUTH0_AUDIENCE || undefined
  })
  return payload
}
