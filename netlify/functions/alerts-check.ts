import type { Config } from "@netlify/functions"
import { getStore } from "@netlify/blobs"

function blobs(name = "sos"){
  const siteID = process.env.BLOBS_SITE_ID || process.env.NETLIFY_SITE_ID || process.env.SITE_ID || process.env.API_ID
  const token  = process.env.BLOBS_TOKEN   || process.env.NETLIFY_ACCESS_TOKEN || process.env.NETLIFY_API_TOKEN || process.env.PERSONAL_ACCESS_TOKEN
  return (siteID && token) ? getStore({ name, siteID, token }) : getStore(name)
}

export default async () => {
  const store = blobs("sos")
  const idxKey = "indexes/users.json"
  const raw = await store.get(idxKey)
  const idx = raw ? JSON.parse(raw as string) : {}

  const now = Date.now()
  const thresholdMs = Number(process.env.ALERT_THRESHOLD_MS || 24*60*60*1000)
  const overdue = Object.entries<any>(idx).filter(([_, v]) => now - (v?.lastReportTime ?? 0) > thresholdMs).map(([userId, v]) => ({ userId, lastReportTime: v?.lastReportTime, lastMessage: v?.lastMessage }))

  const out = { now, thresholdMs, overdueCount: overdue.length, overdue }
  const key = `alerts/overdue-${now}.json`
  await store.set(key, JSON.stringify(out))

  const hook = process.env.ALERT_WEBHOOK_URL
  if(hook){
    try{
      await fetch(hook, { method:"POST", headers: { "content-type": "application/json" }, body: JSON.stringify(out) })
    }catch{}
  }
  return new Response(`ok ${overdue.length}`)
}

export const config: Config = { schedule: "@hourly" }
