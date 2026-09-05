import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";
import { sanityFetch } from "@/sanity/lib/live";
import { CONTENT_TERM, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    params: { term: CONTENT_TERM },
    perspective: "published",
    stega: false,
  });

  return {
    title: settings?.seoTitle ?? settings?.organizationName ?? "BEM FISIP Unpad 2026",
    description: settings?.seoDescription ?? "Official Website of BEM FISIP Unpad 2026",
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <SanityLive includeDrafts={false} />
      </body>
    </html>
  );
}
