import type { Metadata } from "next";
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

async function getPost(slug: string) {
  const result = await sanityFetch({
    query: POST_BY_SLUG_QUERY,
    params: { term: CONTENT_TERM, slug },
    perspective: "published",
    stega: false,
  });
  return result.data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return post
    ? {
        title: post.seoTitle ?? post.judul,
        description: post.seoDescription ?? post.excerpt ?? undefined,
      }
    : { title: "Publikasi tidak ditemukan" };
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

  const isKajian = post.postCategory?.toLowerCase().includes("kajian");
  const categoryLabel = isKajian ? "Kajian" : "Artikel";
  const publicationDate = post.publishedAt
    ? new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(post.publishedAt))
    : "";

  return (
    <div
      className="relative overflow-x-hidden min-h-screen text-white pt-24"
      style={{
        background:
          "linear-gradient(180deg, #000c23 0%, #003089 50%, #000c23 100%)",
      }}
    >
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12">
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
                  backgroundColor: isKajian ? "#8CFF00" : "#FFBA3A",
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
                className="inline-flex items-center gap-2 px-8 py-3 font-bold text-sm text-white bg-brand-yellow hover:bg-[#ffd27a] transition-colors shadow-md"
              >
                <span className="sr-only">Lihat Unggahan Resmi di Instagram</span>
                Lihat Unggahan Resmi di Instagram
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}
        </article>
      </main>

      {/* FOOTER */}
      <Footer settings={settingsResult.data} />
    </div>
  );
}