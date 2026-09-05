import test from "node:test";
import assert from "node:assert/strict";
import { safeExternalUrl, safeMailto } from "../sanity/lib/urls";

test("allows only HTTPS external links", () => {
  assert.equal(safeExternalUrl("https://www.instagram.com/bemfisipunpad/"), "https://www.instagram.com/bemfisipunpad/");
  assert.equal(safeExternalUrl("http://example.test"), undefined);
  assert.equal(safeExternalUrl("javascript:alert(1)"), undefined);
});

test("creates mail links only for valid addresses", () => {
  assert.equal(safeMailto("bem@fisip.unpad.ac.id"), "mailto:bem@fisip.unpad.ac.id");
  assert.equal(safeMailto("not-an-email"), undefined);
});
