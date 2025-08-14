// netlify/functions/chat-post.ts
import type { Handler } from "@netlify/functions";

// We don't write to Blobs directly from client for security; we do it here.
// Auth: Expect Auth0 access token in cookie 'nf_jwt' injected by the extension or Authorization: Bearer.
import { getStore } from "@netlify/blobs";

function getUser(event: any) {
  // If using Auth0 extension with Netlify Functions, the verified JWT (if present)
  // is available in event.clientContext?.user (same shape as Identity used to provide).
  const user = event?.clientContext?.user || null;
  return user;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  const user = getUser(event);
  if (!user) {
    return { statusCode: 401, body: "Unauthorized" };
  }
  const body = JSON.parse(event.body || "{}");
  const room = String(body.room || "general");
  const text = String(body.text || "").trim();
  if (!text) return { statusCode: 400, body: "Empty text" };

  const store = getStore({ name: "chat" });
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const msg = {
    id,
    room,
    userId: user.sub || user.email || "user",
    userName: user.name || user.email || "익명",
    text,
    ts: Date.now()
  };
  // Key shape: rooms/{room}/messages/{id}.json
  const key = `rooms/${room}/messages/${id}.json`;
  await store.setJSON(key, msg);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true, id })
  };
};
