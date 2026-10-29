import test from "node:test";
import assert from "node:assert/strict";
import { isIsolatedTestMode, resolveSiteConfig } from "../lib/site-config";

test("release builds fail without an origin even when CI is true", () => {
  assert.throws(() => resolveSiteConfig({ NODE_ENV: "production", CI: "true", NEXT_PUBLIC_SITE_ENV: "production" }), /NEXT_PUBLIC_SITE_URL/);
  assert.throws(() => resolveSiteConfig({ NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: "https://example.org" }), /NEXT_PUBLIC_SITE_ENV/);
});

test("only explicitly configured production can be indexed", () => {
  const origin = "https://bem.example.org";
  assert.equal(resolveSiteConfig({ NODE_ENV: "production", NEXT_PUBLIC_SITE_ENV: "staging", NEXT_PUBLIC_SITE_URL: origin }).indexable, false);
  assert.equal(resolveSiteConfig({ NODE_ENV: "production", NEXT_PUBLIC_SITE_ENV: "production", NEXT_PUBLIC_SITE_URL: origin }).indexable, true);
  assert.equal(resolveSiteConfig({ NODE_ENV: "production", SANITY_TEST_MODE: "true" }).indexable, false);
});

test("release URLs reject credentials, paths, and insecure origins", () => {
  for (const url of ["http://example.org", "https://user:pass@example.org", "https://example.org/path", "https://example.org/?query=1", "https://example.org/#fragment", "https://localhost"]) {
    assert.throws(() => resolveSiteConfig({ NODE_ENV: "production", NEXT_PUBLIC_SITE_ENV: "production", NEXT_PUBLIC_SITE_URL: url }));
  }
});

test("hosting cannot accidentally use fixtures or development mode", () => {
  assert.throws(() => isIsolatedTestMode({ SANITY_TEST_MODE: "true", VERCEL: "1" }), /must not/);
  assert.throws(() => resolveSiteConfig({ VERCEL: "1", NEXT_PUBLIC_SITE_ENV: "development" }), /Hosting/);
  assert.throws(() => resolveSiteConfig({ SANITY_TEST_MODE: "true", NEXT_PUBLIC_SITE_URL: "https://example.org" }), /loopback/);
});
