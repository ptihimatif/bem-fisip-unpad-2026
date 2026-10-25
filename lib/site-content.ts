import { safeExternalUrl } from "../sanity/lib/urls";

export type EditableSiteSettings = {
  fisipCareCenterUrl?: string | null;
  replaceDefaultSocialLinks?: boolean | null;
  socialLinks?: { platform: string; url?: string | null }[] | null;
};

const defaultSocialLinks = [
  { label: "Instagram", src: "/assets/logo/ig.svg", href: "https://www.instagram.com/bemfisipunpad/" },
  { label: "TikTok", src: "/assets/logo/tiktok.svg", href: "https://www.tiktok.com/@bemfisipunpad" },
  { label: "LinkedIn", src: "/assets/logo/linkedin.svg", href: "https://id.linkedin.com/company/bemfisipunpad" },
  { label: "YouTube", src: "/assets/logo/yt.svg", href: "https://www.youtube.com/@bemfisipunpad4007" },
  { label: "X", src: "/assets/logo/x.svg", href: "https://x.com/bemfisipunpad" },
];
const platformKey = (value: string) => value.toLowerCase().replace(/\s/g, "").replace(/^twitter$/, "x");

export function getCareCenterUrl(settings?: EditableSiteSettings | null) {
  return safeExternalUrl(settings?.fisipCareCenterUrl) ?? "https://www.instagram.com/fisipcarecenter/";
}

/** Preserve existing links until an editor explicitly makes the CMS list exhaustive. */
export function getSocialLinks(settings?: EditableSiteSettings | null) {
  const items = new Map<string, { label: string; href: string; src?: string }>();
  if (!settings?.replaceDefaultSocialLinks) {
    for (const item of defaultSocialLinks) items.set(platformKey(item.label), item);
  }
  for (const link of settings?.socialLinks ?? []) {
    const href = safeExternalUrl(link.url);
    const key = platformKey(link.platform);
    if (!href || !key) continue;
    const standard = defaultSocialLinks.find((item) => platformKey(item.label) === key);
    items.set(key, { label: standard?.label ?? link.platform, src: standard?.src, href });
  }
  return [...items.values()];
}

export function youtubeEmbedUrl(value?: string | null) {
  if (!value) return "https://www.youtube.com/embed/znT9GP-2LYo";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return undefined;
    const id = url.hostname === "youtu.be" ? url.pathname.slice(1) :
      ["youtube.com", "www.youtube.com"].includes(url.hostname) ?
        (url.pathname === "/watch" ? url.searchParams.get("v") : url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1]) : undefined;
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? `https://www.youtube.com/embed/${id}` : undefined;
  } catch { return undefined; }
}
