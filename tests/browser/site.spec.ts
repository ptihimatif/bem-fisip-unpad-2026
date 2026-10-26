import { test, expect } from "@playwright/test";
import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

test.beforeEach(async ({ page }) => {
  // Third-party embeds are not part of this deterministic application regression suite.
  await page.route(/https:\/\/(www\.instagram\.com|www\.youtube\.com)\//, (route) => route.fulfill(
    route.request().url().endsWith("/embed.js")
      ? { body: 'window.instgrm = { Embeds: { process() { document.querySelector(".instagram-media")?.setAttribute("data-test-processed", "true"); } } };', contentType: "text/javascript" }
      : { body: "", contentType: "text/html" },
  ));
  await page.route("https://cdn.sanity.io/**", (route) => route.fulfill({
    body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jD1sAAAAASUVORK5CYII=", "base64"),
    contentType: "image/png",
  }));
});

test("home hydrates, uses an ICO, and protects staging from indexing", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  expect(response?.headers()["x-robots-tag"]).toContain("noindex");
  await expect(page.getByRole("heading", { name: "BEM FISIP UNPAD 2026", exact: true })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^http:\/\/127\.0\.0\.1:3123\/?$/);
  const icon = await request.get("/favicon.ico");
  expect(icon.status()).toBe(200);
  expect([...((await icon.body()).subarray(0, 4))]).toEqual([0, 0, 1, 0]);
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
  await expect(page.getByText("Mahasiswa Uji", { exact: true }).first()).toBeAttached();
  await expect(page.locator("a.group h2")).toHaveText(["Publikasi Uji 1", "Publikasi Uji 2", "Publikasi Uji 3"]);
  const skip = page.getByRole("link", { name: "Lewati ke konten" });
  await skip.focus();
  expect(await skip.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const hit = document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    return element === hit || element.contains(hit);
  })).toBe(true);
  expect(errors).toEqual([]);
});

test("navigation and structured CMS copy are usable on About", async ({ page, isMobile }, info) => {
  await page.goto("/");
  const navbar = page.locator("nav").first();
  if (isMobile) await navbar.getByRole("button", { name: "Toggle navigation menu" }).click();
  await navbar.getByRole("link", { name: "Tentang", exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { name: "Empati dari Studio", exact: true })).toBeAttached();
  await expect(page.getByText("Misi dari Studio", { exact: true })).toBeAttached();
  await expect(page.getByText("Budaya dari Studio", { exact: true })).toBeAttached();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "http://127.0.0.1:3123/about");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "http://127.0.0.1:3123/about");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await page.screenshot({ path: info.outputPath("about.png"), fullPage: false });
});

test("program modal supports reduced motion, Escape, and focus restoration", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Program Uji", exact: true }).first();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Program Uji" });
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole("button", { name: "Tutup" });
  await expect(close).toBeFocused();
  await page.screenshot({ path: info.outputPath("program-modal.png") });
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "Program Rich Text Uji", exact: true }).first().click();
  await expect(page.getByRole("dialog").getByText("Deskripsi lengkap dari fixture.")).toHaveCSS("color", "rgb(0, 12, 35)");
  await page.keyboard.press("Escape");
});

test("public routes, filters, missing content, and SEO have stable output", async ({ page, request, isMobile }) => {
  await page.goto("/article?category=kajian&sort=terlama");
  await expect(page.getByRole("heading", { name: "Publikasi Uji 2", exact: true })).toBeAttached();
  await expect(page.getByRole("heading", { name: "Publikasi Uji 1", exact: true })).toHaveCount(0);
  if (!isMobile) {
    const title = page.getByRole("heading", { name: "Publikasi Uji 2", exact: true });
    await title.hover();
    await expect(title).toHaveCSS("color", "rgb(0, 48, 137)");
  }
  for (const path of ["/hima", "/penjelasan/biro-kesekretariatan", "/post/publikasi-uji-1", "/sitemap.xml", "/studio"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
  for (const path of ["/post/missing", "/penjelasan/missing"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: "Halaman Tidak Ditemukan" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  }
});

test("all achievement cards remain reachable with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const region = page.getByRole("region", { name: "Mahasiswa berprestasi", exact: true });
  const viewport = region.locator(".infinite-carousel");
  await region.scrollIntoViewIfNeeded();
  await expect(region.locator(".infinite-carousel-track")).toHaveCSS("animation-name", "none");
  await expect(viewport).toHaveCSS("overflow-x", "auto");
  await viewport.focus();
  await page.keyboard.press("End");
  await expect(region.getByText("Mahasiswa Uji 5", { exact: true }).first()).toBeInViewport();
  await expect(region.locator(".infinite-carousel-copy")).toHaveCount(0);
  expect(await viewport.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
});

test("carousels have no visible controls and mobile-menu Escape works", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const region = page.getByRole("region", { name: "Mahasiswa berprestasi", exact: true });
  await expect(page.getByRole("button", { name: /^(Jeda|Putar|Tampilkan sebelumnya|Tampilkan berikutnya|Previous programs|Next programs)$/ })).toHaveCount(0);
  await expect(region).toHaveAttribute("aria-busy", "false");
  await region.locator(".infinite-carousel").focus();
  await expect(region.locator(".infinite-carousel-track")).toHaveCSS("animation-name", "none");
  if (isMobile) {
    const toggle = page.getByRole("button", { name: "Toggle navigation menu" });
    await toggle.click();
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  }
});

test("publication pagination is bounded and CMS errors offer recovery", async ({ page }) => {
  await page.goto("/article?page=999");
  await expect(page.getByRole("heading", { name: "Publikasi Uji 9", exact: true })).toBeAttached();
  await expect(page.getByRole("heading", { name: "Publikasi Uji 1", exact: true })).toHaveCount(0);
  await page.goto("/article?category=invalid&sort=invalid&page=-1");
  await expect(page.getByRole("heading", { name: "Publikasi Uji 1", exact: true })).toBeAttached();
  await expect(page.getByRole("heading", { name: "Publikasi Uji 6", exact: true })).toHaveCount(0);
  await page.goto("/post/cms-unavailable");
  await expect(page.getByRole("heading", { name: "Terjadi Kesalahan", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Coba Lagi", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Terjadi Kesalahan", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Kembali ke Artikel", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Artikel dan Kajian", exact: true })).toBeVisible();
});

test("About stays readable at reduced motion and 200 percent text zoom", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  const philosophy = page.getByRole("region", { name: "Filosofi logo Pendar Mentari", exact: true });
  await expect(philosophy.getByRole("heading", { name: "Warna Biru", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  const region = page.locator('[aria-roledescription="carousel"][aria-label="Kepala dan Wakil Kepala Departemen & Biro"]');
  await expect(region.locator(".infinite-carousel")).toHaveCSS("overflow-x", "auto");
  await expect(region.getByRole("button")).toHaveCount(0);
});

test("signed revalidation executes inside the real Next.js request context", async ({ request }) => {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  expect(secret).toBe("isolated-browser-webhook-secret");
  const body = JSON.stringify({ _type: "program" });
  const rejected = await request.post("/api/revalidate", { data: body, headers: { "content-type": "application/json" } });
  expect(rejected.status()).toBe(401);
  const signature = await encodeSignatureHeader(body, Date.now(), secret!);
  const response = await request.post("/api/revalidate", {
    data: body,
    headers: { "content-type": "application/json", [SIGNATURE_HEADER_NAME]: signature },
  });
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ revalidated: true });
});

test("duplicate program cards restore accessible focus and the loop survives resize", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const track = page.locator('[aria-label="Program unggulan"]');
  await expect(track.locator("button[data-card]")).toHaveCount(15);
  await expect(track.getByRole("button")).toHaveCount(5);
  await expect(track).toHaveCSS("scrollbar-width", "none");
  // Freeze wrapping while deliberately reaching a visual copy with native scroll.
  await track.focus();
  const clone = track.locator('button[aria-hidden="true"]').first();
  await clone.click();
  const dialog = page.getByRole("dialog", { name: "Program Uji", exact: true });
  await expect(dialog).toBeVisible();
  await expect(page.locator("main")).toHaveJSProperty("inert", true);
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Tutup" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("main")).toHaveJSProperty("inert", false);
  const canonical = track.getByRole("button", { name: "Program Uji", exact: true });
  await expect(canonical).toBeFocused();
  await expect(canonical).toBeInViewport();
  await page.setViewportSize({ width: isMobile ? 430 : 1100, height: 800 });
  await canonical.click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Tutup" }).click();
  await expect(canonical).toBeFocused();
  await canonical.blur();
  await track.evaluate((element) => { element.scrollLeft = 0; });
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test("third-party media waits until nearby and Instagram works after client navigation", async ({ page, isMobile }) => {
  await page.setViewportSize({ width: isMobile ? 390 : 1280, height: 300 });
  const requested: string[] = [];
  page.on("request", (request) => {
    if (/www\.(instagram|youtube)\.com/.test(request.url())) requested.push(request.url());
  });
  const response = await page.goto("/");
  expect(await response!.text()).toMatch(/<iframe(?![^>]*\bsrc=)[^>]*title="Video profil BEM FISIP UNPAD"/);
  const video = page.locator('iframe[title="Video profil BEM FISIP UNPAD"]');
  const nearVideo = await video.evaluate((element) => element.getBoundingClientRect().top <= innerHeight + 400);
  if (!nearVideo) await expect(video).not.toHaveAttribute("src");
  expect(requested.filter((url) => url.includes("instagram.com"))).toEqual([]);
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute("src", /youtube\.com\/embed\//);
  const instagram = page.locator(".instagram-media");
  await instagram.scrollIntoViewIfNeeded();
  await expect(instagram).toHaveAttribute("data-test-processed", "true");
  const scriptRequests = requested.filter((url) => url.endsWith("/embed.js")).length;
  expect(scriptRequests).toBe(1);
  const navbar = page.locator("nav").first();
  if (isMobile) await navbar.getByRole("button", { name: "Toggle navigation menu" }).click();
  await navbar.getByRole("link", { name: "Tentang", exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await navbar.locator('a[href="/"]').first().click();
  await expect(page).toHaveURL(/\/$/);
  await instagram.scrollIntoViewIfNeeded();
  await expect(instagram).toHaveAttribute("data-test-processed", "true");
  expect(requested.filter((url) => url.endsWith("/embed.js"))).toHaveLength(1);
});

test("SEO keeps archive pages distinct and includes factual article structured data", async ({ page, request }) => {
  await page.goto("/article?page=2&utm_source=test");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "http://127.0.0.1:3123/article?page=2");
  await expect(page).toHaveTitle(/Halaman 2/);
  await page.goto("/article?page=999");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "http://127.0.0.1:3123/article?page=2");
  await page.goto("/post/publikasi-uji-1");
  await expect(page.locator('meta[property="article:modified_time"]')).toHaveAttribute("content", "2026-10-27T08:00:00Z");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /logo-full\.png$/);
  const graph = await page.locator('script[type="application/ld+json"]').evaluateAll((elements) => elements.flatMap((element) => {
    const data = JSON.parse(element.textContent || "{}");
    return data["@graph"] || [data];
  }));
  expect(graph.find((item) => item["@type"] === "Article")).toMatchObject({
    headline: "Publikasi Uji 1", datePublished: "2026-10-26T08:00:00Z", dateModified: "2026-10-27T08:00:00Z",
    url: "http://127.0.0.1:3123/post/publikasi-uji-1", inLanguage: "id-ID",
  });
  expect(graph.find((item) => item["@type"] === "BreadcrumbList").itemListElement).toHaveLength(3);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/post/publikasi-uji-1");
  expect(sitemap).not.toContain("/studio");
  await page.goto("/post/missing");
  expect(await page.locator('script[type="application/ld+json"]').allTextContents()).not.toEqual(expect.arrayContaining([expect.stringContaining('"@type":"Article"')]));
});

test("Sanity images offer responsive CDN sources without a second image proxy", async ({ page }) => {
  await page.goto("/");
  const track = page.locator('[aria-label="Program unggulan"]');
  const card = track.getByRole("button", { name: "Program Uji", exact: true });
  await card.scrollIntoViewIfNeeded();
  const image = card.locator("img");
  await expect(card.locator("picture source")).toHaveAttribute("srcset", /320w.*480w.*1200w/);
  await expect(image).toHaveAttribute("alt", "Sampul program pengujian");
  expect(await image.evaluate((element: HTMLImageElement) => element.currentSrc)).toContain("cdn.sanity.io");
  expect(await image.evaluate((element: HTMLImageElement) => element.currentSrc)).not.toContain("/_next/image");
});

test("animated modal closes once and restores the page after browser navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/article");
  await page.locator('nav a[href="/"]').first().click();
  const trigger = page.getByRole("button", { name: "Program Uji", exact: true });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Artikel dan Kajian", exact: true })).toBeVisible();
  await expect(page.locator("main")).toHaveJSProperty("inert", false);
  expect(await page.locator("body").evaluate((element) => element.style.overflow)).not.toBe("hidden");
});
