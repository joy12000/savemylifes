// netlify/functions/blobs-status.ts
import type { Handler } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export const handler: Handler = async () => {
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

  const usingExplicit = Boolean(siteID && token);
  let listOk = false;
  let error: any = null;

  try {
    const store = usingExplicit
      ? getStore({ name: "chat", siteID, token })
      : getStore({ name: "chat" });
    await store.list({ prefix: "rooms/", limit: 1 } as any);
    listOk = true;
  } catch (e: any) {
    error = { message: e?.message || String(e) };
  }

  return {
    statusCode: listOk ? 200 : 500,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      envSeen: {
        BLOBS_SITE_ID: Boolean(process.env.BLOBS_SITE_ID),
        NETLIFY_SITE_ID: Boolean(process.env.NETLIFY_SITE_ID),
        SITE_ID: Boolean(process.env.SITE_ID),
        API_ID: Boolean(process.env.API_ID),
        BLOBS_TOKEN: Boolean(process.env.BLOBS_TOKEN),
        NETLIFY_ACCESS_TOKEN: Boolean(process.env.NETLIFY_ACCESS_TOKEN),
        NETLIFY_API_TOKEN: Boolean(process.env.NETLIFY_API_TOKEN),
        PERSONAL_ACCESS_TOKEN: Boolean(process.env.PERSONAL_ACCESS_TOKEN),
      },
      usingExplicit,
      listOk,
      error
    }, null, 2),
  };
};
