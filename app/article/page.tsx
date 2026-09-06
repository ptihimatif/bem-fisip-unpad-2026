import Link from "next/link";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/lib/live";
import { CONTENT_TERM, PUBLICATION_COUNT_QUERY, PUBLICATION_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

const dateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" });

export default async function ArticlePage() {
  const params = { term: CONTENT_TERM };
  const [settingsResult, postsResult, countResult] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, params, perspective: "published", stega: false }),
    sanityFetch({ query: PUBLICATION_PAGE_QUERY, params, perspective: "published", stega: false }),
    sanityFetch({ query: PUBLICATION_COUNT_QUERY, params, perspective: "published", stega: false }),
  ]);
  const posts = postsResult.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 pt-24">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <section aria-labelledby="publication-title">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-brand-blue)]">{countResult.data ?? 0} publikasi</p>
          <h1 id="publication-title" className="mt-2 text-4xl font-extrabold text-[var(--color-brand-blue)]">Artikel dan Kajian</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">Baca publikasi resmi BEM FISIP Unpad 2026.</p>
        </section>
        {posts.length === 0 ? <p className="mt-10 bg-slate-100 p-4 text-slate-600">Belum ada publikasi yang dipublikasikan.</p> : (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <article key={post._id} className="border bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-brand-blue)]">{post.postCategory}</p>
                <h2 className="mt-2 text-2xl font-bold"><Link href={`/post/${post.slug}`} className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">{post.judul}</Link></h2>
                <p className="mt-2 text-sm text-slate-500">{dateFormatter.format(new Date(post.publishedAt))}</p>
                {post.excerpt && <p className="mt-3 leading-7 text-slate-600">{post.excerpt}</p>}
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer settings={settingsResult.data} />
    </div>
  );
}
