import type { Context } from "@netlify/functions"
import { blobs, verifyAuth0 } from "./_common"

export default async (req: Request, _ctx: Context) => {
  if(req.method !== "POST") return new Response("Method Not Allowed", { status: 405 })
  const auth = req.headers.get("authorization") || ""
  const idToken = auth.startsWith("Bearer ") ? auth.slice(7) : ""
  if(!idToken) return new Response("Unauthorized", { status: 401 })

  const { sub } = await verifyAuth0(idToken)
  const { room = "general", text = "" } = await req.json().catch(()=>({}))
  if(!String(text).trim()) return new Response("Bad Request", { status: 400 })

  const store = blobs("chat")
  const msg = { id: crypto.randomUUID(), userId: String(sub), text: String(text), ts: Date.now() }
  await store.set(`rooms/${room}/messages/${msg.id}.json`, JSON.stringify(msg))
  await store.set(`rooms/${room}/latest.json`, JSON.stringify(msg))
  return new Response(JSON.stringify({ ok: true, msg }), { headers: { "content-type": "application/json" } })
}
