import test from "node:test";
import assert from "node:assert/strict";
import { safeExternalUrl } from "../sanity/lib/urls";

test("allows only HTTPS external links", () => {
  assert.equal(safeExternalUrl("https://www.instagram.com/bemfisipunpad/"), "https://www.instagram.com/bemfisipunpad/");
  assert.equal(safeExternalUrl("http://example.test"), undefined);
  assert.equal(safeExternalUrl("javascript:alert(1)"), undefined);
});
