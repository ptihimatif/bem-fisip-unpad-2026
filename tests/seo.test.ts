import assert from "node:assert/strict";
import test from "node:test";
import { publicationDescription, publicationStructuredData, serializeJsonLd } from "../lib/seo";
import { publicationCanonical, publicationFilters } from "../lib/publications";

test("archive canonicals keep distinct pages and categories without tracking parameters", () => {
  assert.equal(publicationCanonical(publicationFilters({ utm_source: "instagram", page: "1" })), "/article");
  assert.equal(publicationCanonical(publicationFilters({ page: "2" })), "/article?page=2");
  assert.equal(publicationCanonical(publicationFilters({ category: "kajian", sort: "terlama", page: "2" })), "/article?category=kajian&sort=terlama&page=2");
});

test("JSON-LD safely preserves client text without allowing script termination", () => {
  const value = { headline: '</script><script>alert("test")</script> & judul' };
  const serialized = serializeJsonLd(value);
  assert.equal(serialized.includes("<"), false);
  assert.deepEqual(JSON.parse(serialized), value);
});

test("article structured data uses actual publication facts without inventing an author or image", () => {
  const data = publicationStructuredData({ origin: "https://bem.example.org", organizationName: "BEM FISIP Unpad 2026", post: { judul: "Kajian mahasiswa", slug: "kajian mahasiswa", postCategory: "kajian", publishedAt: "2026-10-26T08:00:00Z", _updatedAt: "2026-10-27T08:00:00Z" } });
  const [article, breadcrumb] = data["@graph"];
  assert.equal(article.url, "https://bem.example.org/post/kajian%20mahasiswa");
  assert.equal(article.dateModified, "2026-10-27T08:00:00Z");
  assert.equal(article.articleSection, "Kajian");
  assert.equal("author" in article, false);
  assert.equal(article.image, undefined);
  assert.equal(breadcrumb.itemListElement?.length, 3);
});

test("description falls back to existing text and leaves empty content absent", () => {
  assert.equal(publicationDescription({ seoDescription: "  SEO  ", excerpt: "Ringkasan" }), "SEO");
  assert.equal(publicationDescription({ seoDescription: " ", excerpt: "Ringkasan" }), "Ringkasan");
  assert.equal(publicationDescription({ body: [{ children: [{ text: "Isi\n" }, { text: "publikasi" }] }] }), "Isi publikasi");
  assert.equal(publicationDescription({}), undefined);
});
