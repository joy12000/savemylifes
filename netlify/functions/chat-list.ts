// netlify/functions/chat-list.ts
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
    audience: process.env.AUTH0_AUDIENCE || process.env.VITE_AUTH0_AUDIENCE
  });
  return payload;
}

export const handler: Handler = async (event) => {
  try {
    // 읽기에도 인증을 요구(원하면 주석 처리로 Public 읽기로 변경 가능)
    const payload = await verifyAuth(event);
    if (!payload) return { statusCode: 401, body: "Unauthorized" };

    const params = event.queryStringParameters || {};
    const room = String(params.room || "general");
    const limit = Math.min(parseInt(String(params.limit || "50")), 200);

    const store = getStore({ name: "chat" });
    const prefix = `rooms/${room}/messages/`;
    const listing = await store.list({ prefix });
    const keys = (listing.blobs || []).map(b => b.key).sort();
    const last = keys.slice(-limit);

    const messages = [];
    for (const key of last) {
      try {
        const m = await store.getJSON(key);
        if (m) messages.push(m);
      } catch {}
    }
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages }) };
  } catch (err: any) {
    return { statusCode: 401, body: "Unauthorized: " + (err?.message || "verify failed") };
  }
};
