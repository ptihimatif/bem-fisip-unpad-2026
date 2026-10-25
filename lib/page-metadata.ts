import type { Metadata } from "next";
import { getSiteSettings } from "@/sanity/lib/settings";

export async function getPageMetadata({ path, title, description }: { path: string; title: string; description: string }): Promise<Metadata> {
  const settings = await getSiteSettings();
  const images = settings?.ogImage?.asset?.url ? [settings.ogImage.asset.url] : undefined;
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", siteName: settings?.organizationName ?? "BEM FISIP Unpad 2026", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
