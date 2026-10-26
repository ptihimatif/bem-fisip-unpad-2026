/** Read-only release smoke check. Never publishes content or changes services. */
import assert from "node:assert/strict";
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    environment: { type: "string", default: "staging" },
    post: { type: "string" },
    unit: { type: "string" },
    "allow-local": { type: "boolean", default: false },
  },
});
assert.equal(positionals.length, 1, "Usage: node scripts/verify_deployment.mjs https://ORIGIN --environment staging|production [--post SLUG] [--unit SLUG]");
assert.ok(["staging", "production"].includes(values.environment), "Choose staging or production");
const origin = new URL(positionals[0]);
assert.ok(!origin.username && !origin.password && !origin.search && !origin.hash && origin.pathname === "/", "Provide only the canonical origin");
const local = ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);
assert.ok(origin.protocol === "https:" || (local && values["allow-local"] && values.environment === "staging"), "HTTPS is required; loopback checks need --allow-local --environment staging");
const indexable = values.environment === "production";
const results = [];

async function read(path) {
  const response = await fetch(new URL(path, origin), {
    // HTML-limited bots receive complete head metadata rather than streaming it.
    headers: { "user-agent": "Twitterbot/1.0", "cache-control": "no-cache" },
    redirect: "error",
    signal: AbortSignal.timeout(30_000),
  });
  assert.equal(response.status, 200, `${path}: expected HTTP 200`);
  return { response, text: await response.text() };
}

function attribute(tag, name) {
  return new RegExp(`\\b${name}=["']([^"']*)["']`, "i").exec(tag)?.[1].replace(/&amp;/g, "&");
}
function meta(html, name) {
  return [...html.matchAll(/<meta\s[^>]*>/gi)].map(([tag]) => tag)
    .filter((tag) => attribute(tag, "name") === name || attribute(tag, "property") === name)
    .map((tag) => attribute(tag, "content") || "");
}

async function page(path, canonical = path) {
  const { response, text } = await read(path);
  const link = [...text.matchAll(/<link\s[^>]*>/gi)].map(([tag]) => tag).find((tag) => attribute(tag, "rel") === "canonical");
  const canonicalUrl = link && attribute(link, "href");
  assert.equal(canonicalUrl && new URL(canonicalUrl).href, new URL(canonical, origin).href, `${path}: canonical`);
  assert.ok(/<html[^>]*\blang="id"/.test(text), `${path}: Indonesian language`);
  assert.ok(/<title>[^<]+<\/title>/.test(text), `${path}: title`);
  assert.ok(meta(text, "description").some(Boolean), `${path}: description`);
  assert.ok(meta(text, "og:image").some((url) => /^https?:\/\//.test(url)), `${path}: social image`);
  assert.equal(meta(text, "robots").some((value) => /\bnoindex\b/.test(value)), !indexable, `${path}: indexing policy`);
  assert.equal(/\bnoindex\b/.test(response.headers.get("x-robots-tag") || ""), !indexable, `${path}: indexing header`);
  assert.ok(!text.includes("Mahasiswa Uji") && !text.includes("Publikasi Uji"), `${path}: fixture content must not be deployed`);
  results.push({ path, status: "passed" });
  return text;
}

try {
  for (const path of ["/", "/about", "/article", "/hima"]) await page(path);
  if (values.post) {
    const html = await page(`/post/${encodeURIComponent(values.post)}`);
    const data = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
      .flatMap(([, json]) => { const item = JSON.parse(json); return item["@graph"] || [item]; });
    assert.ok(data.some((item) => item["@type"] === "Article"), "Publication must have Article structured data");
    assert.ok(data.some((item) => item["@type"] === "BreadcrumbList"), "Publication must have breadcrumbs");
  }
  if (values.unit) await page(`/penjelasan/${encodeURIComponent(values.unit)}`);
  const { text: robots } = await read("/robots.txt");
  assert.ok(indexable ? /Allow: \/(?:\r?\n|$)/.test(robots) && robots.includes(`${origin.origin}/sitemap.xml`) : /Disallow: \/(?:\r?\n|$)/.test(robots), "robots.txt must match the chosen release environment");
  const { text: sitemap } = await read("/sitemap.xml");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url);
  assert.ok(urls.length >= 4 && urls.every((url) => new URL(url).origin === origin.origin), "Sitemap must use the canonical origin");
  assert.ok(urls.every((url) => !/\/(studio|api)(\/|$)/.test(new URL(url).pathname)), "Sitemap must exclude admin/API routes");
  if (values.post) assert.ok(urls.includes(new URL(`/post/${encodeURIComponent(values.post)}`, origin).href), "Published post must be in sitemap");
  if (values.unit) assert.ok(urls.includes(new URL(`/penjelasan/${encodeURIComponent(values.unit)}`, origin).href), "Unit must be in sitemap");
  const { text: studio, response: studioResponse } = await read("/studio");
  assert.ok(meta(studio, "robots").some((value) => /noindex/.test(value)) || /noindex/.test(studioResponse.headers.get("x-robots-tag") || ""), "Studio must not be indexable");
  const { response: icon } = await read("/favicon.ico");
  assert.ok(/image\//.test(icon.headers.get("content-type") || ""), "Favicon must be served as an image");
  results.push({ path: "robots/sitemap/studio/favicon", status: "passed" });
  console.log(JSON.stringify({ origin: origin.origin, environment: values.environment, results, remaining: "Admin login, approved CRUD with Live tabs closed, webhook Attempts, physical-device checks, backup access and rollback still require an operator." }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ origin: origin.origin, environment: values.environment, results, error: error.message }, null, 2));
  process.exitCode = 1;
}
