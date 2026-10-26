import type { Metadata } from "next";
import { cache } from "react";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";
import { SanityPortableText } from "@/components/SanityPortableText";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/lib/live";
import {
  CONTENT_TERM,
  POST_BY_SLUG_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import { safeExternalUrl } from "@/sanity/lib/urls";
import { resolveSiteConfig } from "@/lib/site-config";
import { getSiteSettings } from "@/sanity/lib/settings";
import { DEFAULT_ORGANIZATION_NAME, DEFAULT_SOCIAL_IMAGE, publicationDescription, publicationStructuredData, serializeJsonLd } from "@/lib/seo";

const getPost = cache(async (slug: string) => {
  const result = await sanityFetch({
    query: POST_BY_SLUG_QUERY,
    params: { term: CONTENT_TERM, slug },
    perspective: "published",
    stega: false,
  });
  return result.data;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "Publikasi tidak ditemukan", robots: { index: false, follow: false } };
  }

  const title = post.seoTitle ?? post.judul;
  const description = publicationDescription(post);
  const { origin: baseUrl } = resolveSiteConfig();
  const settings = await getSiteSettings();
  const image = post.seoImage?.asset?.url ?? post.image?.asset?.url ?? settings?.ogImage?.asset?.url ?? DEFAULT_SOCIAL_IMAGE;
  const images = [image];

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/post/${encodeURIComponent(slug)}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${baseUrl}/post/${encodeURIComponent(slug)}`,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post._updatedAt ?? undefined,
      locale: "id_ID",
      siteName: settings?.organizationName ?? DEFAULT_ORGANIZATION_NAME,
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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, settingsResult] = await Promise.all([
    getPost(slug),
    sanityFetch({
      query: SITE_SETTINGS_QUERY,
      params: { term: CONTENT_TERM },
      perspective: "published",
      stega: false,
    }),
  ]);
  if (!post) notFound();
  const socialLink = safeExternalUrl(post.instagramUrl);
  const structuredData = publicationStructuredData({
    origin: resolveSiteConfig().origin,
    post,
    organizationName: settingsResult.data?.organizationName ?? DEFAULT_ORGANIZATION_NAME,
  });

  const isKajian = post.postCategory?.toLowerCase().includes("kajian");
  const categoryLabel = isKajian ? "Kajian" : "Artikel";
  const publicationDate = post.publishedAt
    ? new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(new Date(post.publishedAt))
    : "";

  return (
    <div
      className="relative overflow-x-hidden min-h-screen text-white pt-24"
      style={{
        backgroundImage: `
    radial-gradient(ellipse 80% 55% at 110% 15%, rgba(0, 48, 137, 0.85) 0%, transparent 65%),
    radial-gradient(ellipse 55% 70% at -10% 40%, rgba(0, 102, 204, 0.55) 0%, transparent 65%),
    radial-gradient(ellipse 45% 35% at 55% 10%, rgba(90, 140, 255, 0.45) 0%, transparent 60%),
    radial-gradient(ellipse 40% 60% at 85% 110%, rgba(0, 30, 90, 0.95) 0%, transparent 65%),
    radial-gradient(circle at 25% 75%, rgba(255, 186, 58, 0.25) 0%, transparent 18%),
    radial-gradient(circle at 65% 65%, rgba(255, 138, 0, 0.25) 0%, transparent 15%),
    linear-gradient(160deg, #000c23 0%, #003089 45%, #000c23 100%)
  `,
      }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        {/* BREADCRUMB / BACK LINK */}
        <div className="mb-8">
          <Link
            href="/article"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-brand-yellow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali ke Artikel dan Kajian
          </Link>
        </div>

        <article>
          {/* BAGIAN HEADER ARTIKEL: judul -> garis -> detail */}
          <header className="mb-10 pb-2">
            <h1
              className="text-depth text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6"
              style={{ letterSpacing: "-0.05em" }}
            >
              {post.judul}
            </h1>

            <div className="relative left-1/2 -translate-x-1/2 w-screen border-t border-white mb-6" />

            <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
              <span
                className="px-2 py-1 font-semibold text-black"
                style={{
                  backgroundColor: isKajian ? "var(--color-brand-yellow)" : "#FFBA3A",
                }}
              >
                {categoryLabel}
              </span>
              {publicationDate && (
                <span className="text-white">- {publicationDate}</span>
              )}
            </div>
          </header>

          {/* GAMBAR UTAMA */}
          <div className="mx-auto max-w-2xl mb-12">
            <SanityImage
              value={post.image}
              width={900}
              height={506}
              sizes="(min-width: 768px) 672px, 100vw"
              fallbackAlt={`Gambar ${post.judul}`}
              className="aspect-video h-auto w-full object-cover border border-white/15 bg-white/5 shadow-md"
              priority
            />
          </div>

          {/* KONTEN ARTIKEL */}
          <div className="mt-10 text-justify text-white text-base sm:text-lg leading-relaxed prose prose-invert prose-lg max-w-none prose-p:!text-white prose-headings:!text-white prose-a:!text-brand-yellow hover:prose-a:!text-[#ffd27a] prose-strong:!text-white prose-li:!text-white">
            <SanityPortableText
              blocks={(post.body ?? []) as unknown as PortableTextBlock[]}
            />
          </div>

          {/* TAUTAN MEDIA SOSIAL */}
          {socialLink && (
            <div className="mt-16 pt-4">
              <a
                href={socialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 font-bold text-sm text-brand-blue tracking-tight bg-brand-yellow hover:bg-brand-yellow/90 transition-colors duration-300 shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow"
              >
                Lihat Unggahan Resmi di Instagram
              </a>
            </div>
          )}
        </article>
      </div>

      {/* FOOTER */}
      <Footer settings={settingsResult.data} />
    </div>
  );
}
