// netlify/edge-functions/chat-sse.ts
import { getStore } from "https://esm.sh/@netlify/blobs@6.5.0";

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  const room = context.params.room || url.searchParams.get("room") || "general";
  const store = getStore({ name: "chat" });

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      let lastKeys: string[] = [];
      // Warmup: send nothing; client will fetch history via REST
      // Poll every 2s for new keys and emit them
      const interval = setInterval(async () => {
        try {
          const listing = await store.list({ prefix: `rooms/${room}/messages/` });
       	  const keys = (listing.blobs || []).map((b: any) => b.key).sort();
          const fresh = keys.filter((k: string) => !lastKeys.includes(k));
          lastKeys = keys.slice(-200);
          for (const key of fresh) {
            const m = await store.getJSON(key);
            if (m) send(m);
          }
        } catch (_err) {
          // soft fail; next tick
        }
      }, 2000);

      // Keepalive
      const ka = setInterval(() => controller.enqueue(new TextEncoder().encode(`:keepalive\n\n`)), 15000);

      // Cleanup
      const abort = () => { clearInterval(interval); clearInterval(ka); controller.close(); };
      // Edge doesn't expose signal directly; rely on connection close handled by platform.
      context.waitUntil(new Promise((resolve) => {}));
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
};
