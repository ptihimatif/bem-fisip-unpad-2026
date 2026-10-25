import test from "node:test";
import assert from "node:assert/strict";
import { getSocialLinks, youtubeEmbedUrl } from "../lib/site-content";
import { visionParts } from "../lib/cabinet-content";

test("CMS social settings preserve fallbacks until the complete-list switch is enabled", () => {
  const settings = { socialLinks: [{ platform: "Tik Tok", url: "https://www.tiktok.com/@updated" }] };
  assert.equal(getSocialLinks(settings).length, 5);
  assert.equal(getSocialLinks(settings).find((item) => item.label === "TikTok")?.href, "https://www.tiktok.com/@updated");
  assert.equal(getSocialLinks({ ...settings, replaceDefaultSocialLinks: true }).length, 1);
  assert.deepEqual(getSocialLinks({ replaceDefaultSocialLinks: true, socialLinks: [{ platform: "X", url: "javascript:alert(1)" }] }), []);
});

test("YouTube embed conversion only accepts exact approved hosts and valid IDs", () => {
  assert.equal(youtubeEmbedUrl("https://youtu.be/znT9GP-2LYo?tracking=1"), "https://www.youtube.com/embed/znT9GP-2LYo");
  for (const url of ["https://youtube.com.evil.example/watch?v=znT9GP-2LYo", "javascript:alert(1)", "http://youtu.be/znT9GP-2LYo", "https://youtu.be/bad"]) assert.equal(youtubeEmbedUrl(url), undefined);
});

test("explicit vision highlights preserve the exact sentence, including overlapping or missing phrases", () => {
  const text = "Pijar Asa bersama mahasiswa.";
  const parts = visionParts(text, [{ phrase: "Pijar Asa", description: "A" }, { phrase: "Asa", description: "B" }, { phrase: "missing", description: "C" }]);
  assert.equal(parts.map((part) => part.text).join(""), text);
  assert.equal(parts.filter((part) => part.term >= 0).length, 1);
});
