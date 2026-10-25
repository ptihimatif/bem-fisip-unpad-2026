import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Third-party embeds are not part of this deterministic application regression suite.
  await page.route(/https:\/\/(www\.instagram\.com|www\.youtube\.com)\//, (route) => route.fulfill({ body: "", contentType: "text/html" }));
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

test("public routes, filters, missing content, and SEO have stable output", async ({ page, request }) => {
  await page.goto("/article?category=kajian&sort=terlama");
  await expect(page.getByRole("heading", { name: "Publikasi Uji 2", exact: true })).toBeAttached();
  await expect(page.getByRole("heading", { name: "Publikasi Uji 1", exact: true })).toHaveCount(0);
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
