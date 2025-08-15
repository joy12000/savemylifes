
import type { Context } from "@netlify/functions"
import { blobs, verifyAuth0 } from "./_common"

export default async (req: Request, _ctx: Context) => {
  const url = new URL(req.url)
  const room = url.searchParams.get("room") || "general"
  const limit = Number(url.searchParams.get("limit") || 50)

  // 인증 강제 (비로그인은 401)
  const auth = req.headers.get("authorization") || ""
  const idToken = auth.startsWith("Bearer ") ? auth.slice(7) : ""
  if(!idToken) return new Response("Unauthorized", { status: 401 })
  await verifyAuth0(idToken)

  const store = blobs("chat")
  // 가장 단순한 리스트: 키프리픽스 사용
  const iter = store.list({ prefix: `rooms/${room}/messages/` })
  const items: any[] = []
  for await (const { key } of iter){
    if(key.endsWith(".json")){
      const raw = await store.get(key)
      if(raw) items.push(JSON.parse(raw as string))
    }
  }
  items.sort((a,b)=>a.ts-b.ts)
  const sliced = items.slice(-limit)
  return new Response(JSON.stringify({ items: sliced }), { headers: { "content-type": "application/json" } })
}
