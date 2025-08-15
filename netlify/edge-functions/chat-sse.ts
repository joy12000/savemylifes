import { getStore } from "@netlify/blobs"

export default async (req: Request) => {
  const url = new URL(req.url)
  const room = url.pathname.split("/").pop() || "general"

  const stream = new ReadableStream({
    async start(controller){
      const enc = new TextEncoder()
      controller.enqueue(enc.encode(`retry: 3000\n\n`))

      const store = getStore("chat")
      let lastTs = 0

      async function tick(){
        try{
          const raw = await store.get(`rooms/${room}/latest.json`)
          if(raw){
            const msg = JSON.parse(raw as string)
            if(msg.ts && msg.ts !== lastTs){
              lastTs = msg.ts
              controller.enqueue(enc.encode(`data: ${JSON.stringify(msg)}\n\n`))
            }
          }
        }catch{}
        setTimeout(tick, 2000)
      }
      tick()
    },
    cancel(){}
  })

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "connection": "keep-alive"
    }
  })
}
