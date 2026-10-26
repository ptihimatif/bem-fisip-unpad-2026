import type { Metadata } from "next";
import { getSiteSettings } from "@/sanity/lib/settings";
import { DEFAULT_ORGANIZATION_NAME, DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";

export async function getPageMetadata({ path, title, description }: { path: string; title: string; description: string }): Promise<Metadata> {
  const settings = await getSiteSettings();
  const images = [settings?.ogImage?.asset?.url || DEFAULT_SOCIAL_IMAGE];
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", locale: "id_ID", siteName: settings?.organizationName ?? DEFAULT_ORGANIZATION_NAME, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
