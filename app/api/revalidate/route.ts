import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CONTENT_CACHE_TAG } from "@/sanity/lib/cache";

type WebhookPayload = { _type?: string };

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ error: "Revalidation is not configured" }, { status: 503 });
  }

  let parsed: Awaited<ReturnType<typeof parseBody<WebhookPayload>>>;
  try {
    parsed = await parseBody<WebhookPayload>(
      request,
      secret,
      true,
    );
  } catch {
    return Response.json({ error: "Invalid webhook request" }, { status: 400 });
  }

  if (!parsed.isValidSignature) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }
  if (!parsed.body?._type || typeof parsed.body._type !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  revalidateTag(CONTENT_CACHE_TAG, { expire: 0 });
  return Response.json({ revalidated: true });
}
