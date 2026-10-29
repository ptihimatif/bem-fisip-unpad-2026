import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";
import { isSanityConfigured } from "@/sanity/env";
import Navbar from "@/components/Navbar";
import { getSiteSettings } from "@/sanity/lib/settings";
import { resolveSiteConfig } from "@/lib/site-config";
import { getSocialLinks } from "@/lib/site-content";
import { DEFAULT_SOCIAL_IMAGE, serializeJsonLd } from "@/lib/seo";

const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter/Inter-VariableFont_opsz,wght.ttf",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-inter",
  fallback: ["Inter", "sans-serif"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const title =
    settings?.seoTitle ??
    settings?.organizationName ??
    "BEM FISIP Unpad 2026";
  const description =
    settings?.seoDescription ?? "Official Website of BEM FISIP Unpad 2026";
  const { origin: baseUrl, indexable } = resolveSiteConfig();
  const images = [settings?.ogImage?.asset?.url || DEFAULT_SOCIAL_IMAGE];

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: "BEM FISIP Unpad 2026",
      locale: "id_ID",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { origin: baseUrl } = resolveSiteConfig();
  const settings = await getSiteSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: settings?.organizationName ?? "BEM FISIP Unpad 2026",
    url: baseUrl,
    logo: `${baseUrl}/assets/LOGO%20KABINET/logo-full.png`,
    sameAs: getSocialLinks(settings).map((item) => item.href),
  };

  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#000c23] text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000] focus:rounded-md focus:bg-brand-yellow focus:px-4 focus:py-2 focus:font-bold focus:text-brand-blue"
        >
          Lewati ke konten
        </a>
        <Navbar careCenterUrl={settings?.fisipCareCenterUrl} />
        <main id="main-content" className="flex-1">{children}</main>
        {isSanityConfigured && <SanityLive includeDrafts={false} />}
      </body>
    </html>
  );
}
