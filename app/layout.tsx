import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SanityLive, sanityFetch } from "@/sanity/lib/live";
import { isSanityConfigured } from "@/sanity/env";
import { CONTENT_TERM, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import Navbar from "@/components/Navbar";

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
    title:
      settings?.seoTitle ??
      settings?.organizationName ??
      "BEM FISIP Unpad 2026",
    description:
      settings?.seoDescription ?? "Official Website of BEM FISIP Unpad 2026",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#000c23] text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        {isSanityConfigured && <SanityLive includeDrafts={false} />}
      </body>
    </html>
  );
}
