import type { Metadata } from "next";
import { cache } from "react";
import { getPageMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import ArticleFilterSort from "@/components/ArticleFilterSort";
import Footer from "@/components/Footer";
import { publicationCanonical, publicationFilters, PUBLICATIONS_PER_PAGE } from "@/lib/publications";
import { resolveSiteConfig } from "@/lib/site-config";
import { sanityFetch } from "@/sanity/lib/live";
import {
  CONTENT_TERM,
  PUBLICATION_PAGE_QUERY,
  PUBLICATION_PAGE_ASC_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";

type ArticleProps = {
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
};

// Share the bounded result between metadata and rendering in the same request.
const getPublicationPage = cache(async (category: string, sort: string, requestedPage: number) => {
  const query = sort === "terlama" ? PUBLICATION_PAGE_ASC_QUERY : PUBLICATION_PAGE_QUERY;
  const fetchPage = (page: number) => sanityFetch({
    query,
    params: { term: CONTENT_TERM, category, start: (page - 1) * PUBLICATIONS_PER_PAGE, end: page * PUBLICATIONS_PER_PAGE },
    perspective: "published",
    stega: false,
  });
  const firstResult = await fetchPage(requestedPage);
  const totalPages = Math.max(1, Math.ceil((firstResult.data?.total ?? 0) / PUBLICATIONS_PER_PAGE));
  const validCurrentPage = Math.min(requestedPage, totalPages);
  const postsResult = validCurrentPage === requestedPage ? firstResult : await fetchPage(validCurrentPage);
  return { totalPages, validCurrentPage, posts: postsResult.data?.posts ?? [] };
});

export async function generateMetadata(props: ArticleProps): Promise<Metadata> {
  const filters = publicationFilters((await props.searchParams) || {});
  const { validCurrentPage } = await getPublicationPage(filters.category, filters.sort, filters.page);
  const heading = filters.category === "semua" ? "Artikel dan Kajian" : filters.category === "kajian" ? "Kajian" : "Artikel";
  const metadata = await getPageMetadata({
    path: publicationCanonical({ ...filters, page: validCurrentPage }),
    title: `${heading}${validCurrentPage > 1 ? ` — Halaman ${validCurrentPage}` : ""} — BEM FISIP Unpad 2026`,
    description: "Baca artikel dan kajian terbaru dari BEM FISIP Unpad 2026. Publikasi resmi, kebijakan, dan pemikiran kritis dari kabinet Pendar Mentari.",
  });
  // Alternative sort orders remain usable without competing in search results.
  if (filters.sort !== "terbaru") metadata.robots = { index: false, follow: resolveSiteConfig().indexable };
  return metadata;
}

export default async function ArticlePage(props: ArticleProps) {
  const filters = publicationFilters((await props.searchParams) || {});
  const currentCategory = filters.category;
  const currentSort = filters.sort;
  const [settingsResult, result] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, params: { term: CONTENT_TERM }, perspective: "published", stega: false }),
    getPublicationPage(currentCategory, currentSort, filters.page),
  ]);
  const { totalPages, validCurrentPage, posts: paginatedPosts } = result;

  // Helper function untuk membuat URL saat tombol di-klik
  const buildUrl = (updates: {
    category?: string;
    sort?: string;
    page?: number;
  }) => {
    const p = new URLSearchParams();
    p.set("category", updates.category ?? currentCategory);
    p.set("sort", updates.sort ?? currentSort);
    // Jika ganti kategori atau sort, otomatis reset ke halaman 1
    p.set(
      "page",
      (
        updates.page ??
        (updates.category || updates.sort ? 1 : validCurrentPage)
      ).toString(),
    );
    return `?${p.toString()}`;
  };

  // Logika untuk menampilkan deretan angka paginasi
  let startPage = Math.max(1, validCurrentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <div className="relative overflow-hidden text-white pt-24 bg-brand-gradient">
      {/* Tambahkan relative z-10 di sini agar semua konten berada di atas gambar */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        {/* HEADER SECTION */}
        <section aria-labelledby="publication-title" className="">
          <h1
            id="publication-title"
            className="text-depth text-4xl sm:text-6xl font-extrabold mt-2"
            style={{ letterSpacing: "-0.05em" }}
          >
            Artikel dan Kajian
          </h1>
        </section>
        {/* GARIS LURUS FULL WIDTH */}
        <div
          className="border-t border-white mt-2.5 mb-10"
          style={{
            position: "relative",
            width: "100vw",
            left: "50%",
            marginLeft: "-50vw",
          }}
        />{" "}
         {/* FILTER & SORT BUTTONS */}
         <ArticleFilterSort
           currentCategory={currentCategory}
           currentSort={currentSort}
           buildUrl={buildUrl}
         />
        {/* LIST ARTICLE CARDS */}
        {paginatedPosts.length === 0 ? (
          <EmptyState text="Data publikasi tidak ditemukan." />
        ) : (
          <div className="flex flex-col gap-6">
            {paginatedPosts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        )}
        {/* PAGINATION NUMBERS */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-3 sm:gap-6 text-lg sm:text-xl font-bold text-white">
            <Link
              href={buildUrl({ page: 1 })}
              className="hover:text-brand-yellow transition-colors"
              aria-label="First Page"
            >
              &lt;&lt;
            </Link>
            <Link
              href={buildUrl({ page: Math.max(1, validCurrentPage - 1) })}
              className="hover:text-brand-yellow transition-colors"
              aria-label="Previous Page"
            >
              &lt;
            </Link>

            {pageNumbers.map((num) => (
              <Link
                key={num}
                href={buildUrl({ page: num })}
                className={`transition-colors ${num === validCurrentPage ? "text-brand-yellow" : "hover:text-brand-yellow"}`}
                aria-current={num === validCurrentPage ? "page" : undefined}
              >
                {num}
              </Link>
            ))}

            <Link
              href={buildUrl({
                page: Math.min(totalPages, validCurrentPage + 1),
              })}
              className="hover:text-brand-yellow transition-colors"
              aria-label="Next Page"
            >
              &gt;
            </Link>
            <Link
              href={buildUrl({ page: totalPages })}
              className="hover:text-brand-yellow transition-colors"
              aria-label="Last Page"
            >
              &gt;&gt;
            </Link>
          </div>
        )}
      </div>

      <Footer settings={settingsResult.data} />
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="w-full">
      <p
        className="p-6 text-white text-sm"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {text}
      </p>
    </div>
  );
}
