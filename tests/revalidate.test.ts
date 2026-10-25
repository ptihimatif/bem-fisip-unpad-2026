import test from "node:test";
import assert from "node:assert/strict";
import type { NextRequest } from "next/server";
import { SIGNATURE_HEADER_NAME, encodeSignatureHeader } from "@sanity/webhook";
import { POST } from "../app/api/revalidate/route";

const SECRET = "test-secret";
const BODY = JSON.stringify({ _type: "post" });

function request(signature?: string) {
  const headers = new Headers({ "content-type": "application/json" });
  if (signature) headers.set(SIGNATURE_HEADER_NAME, signature);
  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers,
    body: BODY,
  }) as unknown as NextRequest;
}

test("revalidate webhook refuses to run without a configured secret", async () => {
  delete process.env.SANITY_REVALIDATE_SECRET;
  const response = await POST(request());
  assert.equal(response.status, 503);
});

test("revalidate webhook rejects missing and forged signatures", async () => {
  process.env.SANITY_REVALIDATE_SECRET = SECRET;
  assert.equal((await POST(request())).status, 401);

  const forged = await encodeSignatureHeader(BODY, Date.now(), "wrong-secret");
  assert.equal((await POST(request(forged))).status, 401);
});

test("revalidate webhook accepts a correctly signed payload", { timeout: 10_000 }, async () => {
  process.env.SANITY_REVALIDATE_SECRET = SECRET;
  const signature = await encodeSignatureHeader(BODY, Date.now(), SECRET);
  // Outside a Next request revalidateTag throws; reaching it proves the signature check passed.
  await assert.rejects(POST(request(signature)), /revalidateTag/);
});
