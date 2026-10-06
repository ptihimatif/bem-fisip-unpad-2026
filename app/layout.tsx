import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SanityLive, sanityFetch } from "@/sanity/lib/live";
import { isSanityConfigured } from "@/sanity/env";
import { CONTENT_TERM, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import Navbar from "@/components/Navbar";

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
  const { data: settings } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    params: { term: CONTENT_TERM },
    perspective: "published",
    stega: false,
  });

  const title =
    settings?.seoTitle ??
    settings?.organizationName ??
    "BEM FISIP Unpad 2026";
  const description =
    settings?.seoDescription ?? "Official Website of BEM FISIP Unpad 2026";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bemfisipunpad.com";

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    icons: { icon: "/assets/favicon.ico" },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: "BEM FISIP Unpad 2026",
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bemfisipunpad.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BEM FISIP Unpad 2026",
    url: baseUrl,
    logo: `${baseUrl}/assets/LOGO%20KABINET/logo-full.png`,
    sameAs: [
      "https://www.instagram.com/bemfisipunpad",
      "https://www.tiktok.com/@bemfisipunpad",
      "https://www.linkedin.com/company/bem-fisip-unpad",
      "https://www.youtube.com/@BEMFISIPUNPAD",
    ],
  };

  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#000c23] text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        {isSanityConfigured && <SanityLive includeDrafts={false} />}
      </body>
    </html>
  );
}
