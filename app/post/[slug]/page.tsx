import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { SanityImage } from "@/components/SanityImage";
import { SanityPortableText } from "@/components/SanityPortableText";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { sanityFetch } from "@/sanity/lib/live";
import { CONTENT_TERM, POST_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { safeExternalUrl } from "@/sanity/lib/urls";

async function getPost(slug: string) {
  const result = await sanityFetch({ query: POST_BY_SLUG_QUERY, params: { term: CONTENT_TERM, slug }, perspective: "published", stega: false });
  return result.data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return post ? { title: post.seoTitle ?? post.judul, description: post.seoDescription ?? post.excerpt ?? undefined } : { title: "Publikasi tidak ditemukan" };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, settingsResult] = await Promise.all([
    getPost(slug),
    sanityFetch({ query: SITE_SETTINGS_QUERY, params: { term: CONTENT_TERM }, perspective: "published", stega: false }),
  ]);
  if (!post) notFound();
  const socialLink = safeExternalUrl(post.instagramUrl);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <SiteHeader organizationName={settingsResult.data?.organizationName} />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <article>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-brand-blue)]">{post.postCategory}</p>
          <h1 className="mt-3 text-4xl font-extrabold text-[var(--color-brand-blue)]">{post.judul}</h1>
          <p className="mt-3 text-sm text-slate-500">{new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(post.publishedAt))}</p>
          <SanityImage value={post.image} width={1200} height={675} sizes="(min-width: 768px) 768px, 100vw" fallbackAlt={`Gambar ${post.judul}`} className="mt-8 aspect-video h-auto w-full rounded-xl object-cover" />
          <div className="mt-10"><SanityPortableText blocks={(post.body ?? []) as unknown as PortableTextBlock[]} /></div>
          {socialLink && <a href={socialLink} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex font-semibold text-[var(--color-brand-blue)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">Lihat unggahan resmi</a>}
        </article>
      </main>
      <SiteFooter officialEmail={settingsResult.data?.officialEmail} careCenterUrl={settingsResult.data?.fisipCareCenterUrl} />
    </div>
  );
}
