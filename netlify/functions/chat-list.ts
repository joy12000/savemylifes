// netlify/functions/chat-list.ts
import type { Handler } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export const handler: Handler = async (event) => {
  const params = event.queryStringParameters || {};
  const room = String(params.room || "general");
  const limit = Math.min(parseInt(String(params.limit || "50")), 200);

  const store = getStore({ name: "chat" });
  // list blobs under the room prefix
  const prefix = `rooms/${room}/messages/`;
  const listing = await store.list({ prefix });
  // listing.blobs is newest last, so slice from end
  const keys = (listing.blobs || []).map(b => b.key).sort();
  const last = keys.slice(-limit);

  const messages = [];
  for (const key of last) {
    try {
      const m = await store.getJSON(key);
      if (m) messages.push(m);
    } catch {}
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  };
};
