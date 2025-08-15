
import type { Handler } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import * as jose from "jose";

function blobsStore() {
  const siteID =
    process.env.BLOBS_SITE_ID ||
    process.env.NETLIFY_SITE_ID ||
    process.env.SITE_ID ||
    process.env.API_ID;
  const token =
    process.env.BLOBS_TOKEN ||
    process.env.NETLIFY_ACCESS_TOKEN ||
    process.env.NETLIFY_API_TOKEN ||
    process.env.PERSONAL_ACCESS_TOKEN;
  return siteID && token
    ? getStore({ name: "chat", siteID, token })
    : getStore({ name: "chat" });
}

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
    audience: process.env.AUTH0_AUDIENCE || process.env.VITE_AUTH0_AUDIENCE,
  });
  return payload;
}

export const handler: Handler = async (event) => {
  try {
    const payload = await verifyAuth(event);
    if (!payload) return { statusCode: 401, body: "Unauthorized" };

    const params = event.queryStringParameters || {};
    const room = String(params.room || "general");
    const limit = Math.min(parseInt(String(params.limit || "50")), 200);

    const store = blobsStore();
    const listing = await store.list({ prefix: `rooms/${room}/messages/` });
    const keys = (listing.blobs || []).map((b) => b.key).sort();
    const last = keys.slice(-limit);

    const messages: any[] = [];
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
