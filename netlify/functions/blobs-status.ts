
import { getStore } from "@netlify/blobs"

export default async () => {
  const siteID = Boolean(process.env.BLOBS_SITE_ID || process.env.NETLIFY_SITE_ID || process.env.SITE_ID || process.env.API_ID)
  const token  = Boolean(process.env.BLOBS_TOKEN   || process.env.NETLIFY_ACCESS_TOKEN || process.env.NETLIFY_API_TOKEN || process.env.PERSONAL_ACCESS_TOKEN)
  const usingExplicit = siteID && token

  let listOk = false
  let error: any = null
  try{
    const store = usingExplicit ? getStore({ name: "chat", siteID: process.env.BLOBS_SITE_ID || process.env.NETLIFY_SITE_ID || process.env.SITE_ID || process.env.API_ID, token: process.env.BLOBS_TOKEN || process.env.NETLIFY_ACCESS_TOKEN || process.env.NETLIFY_API_TOKEN || process.env.PERSONAL_ACCESS_TOKEN }) : getStore("chat")
    for await (const _ of store.list({ prefix: "" })) { listOk = true; break }
  }catch(e){ error = String(e) }

  return new Response(JSON.stringify({ envSeen: { BLOBS_SITE_ID: siteID, BLOBS_TOKEN: token, NETLIFY_SITE_ID: Boolean(process.env.NETLIFY_SITE_ID), SITE_ID: Boolean(process.env.SITE_ID), API_ID: Boolean(process.env.API_ID), NETLIFY_ACCESS_TOKEN: Boolean(process.env.NETLIFY_ACCESS_TOKEN), NETLIFY_API_TOKEN: Boolean(process.env.NETLIFY_API_TOKEN), PERSONAL_ACCESS_TOKEN: Boolean(process.env.PERSONAL_ACCESS_TOKEN) }, usingExplicit, listOk, error }), {
    headers: { "content-type": "application/json" }
  })
}
