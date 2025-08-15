
import type { Context } from "@netlify/functions"
import { getStore } from "@netlify/blobs"
import * as jose from "jose"

function blobs(name = "sos"){
  const siteID = process.env.BLOBS_SITE_ID || process.env.NETLIFY_SITE_ID || process.env.SITE_ID || process.env.API_ID
  const token  = process.env.BLOBS_TOKEN   || process.env.NETLIFY_ACCESS_TOKEN || process.env.NETLIFY_API_TOKEN || process.env.PERSONAL_ACCESS_TOKEN
  return (siteID && token) ? getStore({ name, siteID, token }) : getStore(name)
}

export default async (req: Request, _ctx: Context) => {
  if(req.method !== "POST") return new Response("Method Not Allowed", { status: 405 })
  const auth = req.headers.get("authorization") || ""
  const idToken = auth.startsWith("Bearer ") ? auth.slice(7) : ""
  if(!idToken) return new Response("Unauthorized", { status: 401 })

  const domain = process.env.AUTH0_DOMAIN || process.env.VITE_AUTH0_DOMAIN
  const issuer = `https://${domain}/`
  const JWKS = jose.createRemoteJWKSet(new URL(`${issuer}.well-known/jwks.json`))
  const { payload } = await jose.jwtVerify(idToken, JWKS, {
    issuer,
    audience: process.env.AUTH0_AUDIENCE || process.env.VITE_AUTH0_AUDIENCE || undefined
  })

  const userId = String(payload.sub || "unknown")
  const { message = "I am safe", location } = await req.json().catch(()=>({}))
  const ts = Date.now()
  const report = { id: crypto.randomUUID(), userId, ts, message: String(message), location }

  const store = blobs("sos")
  await store.set(`reports/${userId}/${ts}.json`, JSON.stringify(report))
  await store.set(`users/${userId}.json`, JSON.stringify({ lastReportTime: ts, lastMessage: report.message }))

  const idxKey = "indexes/users.json"
  const raw = await store.get(idxKey)
  const idx = raw ? JSON.parse(raw as string) : {}
  idx[userId] = { lastReportTime: ts, lastMessage: report.message }
  await store.set(idxKey, JSON.stringify(idx))

  return new Response(JSON.stringify({ ok: true, report }), { headers: { "content-type": "application/json" } })
}
