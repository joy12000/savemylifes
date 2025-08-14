// netlify/functions/chat-post.ts
import type { Handler } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import * as jose from "jose";

async function verifyAuth(event: any) {
  const auth = event.headers?.authorization || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  const token = m[1];
  const domain = process.env.AUTH0_DOMAIN || process.env.VITE_AUTH0_DOMAIN;
  if (!domain) throw new Error("Missing AUTH0_DOMAIN env");
  const issuer = `https://${domain}/`;
  const JWKS = jose.createRemoteJWKSet(new URL(`${issuer}.well-known/jwks.json`));
  const { payload } = await jose.jwtVerify(token, JWKS, {
    issuer,
    // audience is optional when using ID token; set if you configured it
    audience: process.env.AUTH0_AUDIENCE || process.env.VITE_AUTH0_AUDIENCE
  });
  return payload;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const payload = await verifyAuth(event);
    if (!payload) return { statusCode: 401, body: "Unauthorized" };

    const body = JSON.parse(event.body || "{}");
    const room = String(body.room || "general");
    const text = String(body.text || "").trim();
    if (!text) return { statusCode: 400, body: "Empty text" };

    const store = getStore({ name: "chat" });
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const msg = {
      id,
      room,
      userId: (payload.sub as string) || "user",
      userName: (payload.name as string) || (payload.email as string) || "익명",
      text,
      ts: Date.now()
    };
    await store.setJSON(`rooms/${room}/messages/${id}.json`, msg);

    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ok: true, id }) };
  } catch (err: any) {
    return { statusCode: 401, body: "Unauthorized: " + (err?.message || "verify failed") };
  }
};
