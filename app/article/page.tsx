import type { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import ArticleFilterSort from "@/components/ArticleFilterSort";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/lib/live";
import {
  CONTENT_TERM,
  PUBLICATION_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";

// Mendukung tipe searchParams untuk Next.js 14 maupun 15
export const metadata: Metadata = {
  title: "Artikel dan Kajian — BEM FISIP Unpad 2026",
  description:
    "Baca artikel dan kajian terbaru dari BEM FISIP Unpad 2026. Publikasi resmi, kebijakan, dan pemikiran kritis dari kabinet Pendar Mentari.",
};

export default async function ArticlePage(props: {
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}) {
  const params = { term: CONTENT_TERM };
  const [settingsResult, postsResult] = await Promise.all([
    sanityFetch({
      query: SITE_SETTINGS_QUERY,
      params,
      perspective: "published",
      stega: false,
    }),
    sanityFetch({
      query: PUBLICATION_PAGE_QUERY,
      params,
      perspective: "published",
      stega: false,
    }),
  ]);

  const rawPosts = postsResult.data ?? [];

  // 1. Mengambil parameter URL (Aman untuk Next.js 14 & 15)
  const searchParams = (await props.searchParams) || {};
  const currentCategory = (
    typeof searchParams.category === "string" ? searchParams.category : "semua"
  ).toLowerCase();
  const currentSort = (
    typeof searchParams.sort === "string" ? searchParams.sort : "terbaru"
  ).toLowerCase();
  const requestedPage =
    typeof searchParams.page === "string"
      ? Number.parseInt(searchParams.page, 10)
      : 1;
  const currentPage = Number.isFinite(requestedPage)
    ? Math.max(1, requestedPage)
    : 1;

  // 2. Logika Filter Berdasarkan Kategori
  const filteredPosts = rawPosts.filter((post) => {
    const isKajian = post.postCategory?.toLowerCase().includes("kajian");
    if (currentCategory === "artikel") return !isKajian;
    if (currentCategory === "kajian") return isKajian;
    return true; // "semua"
  });

  // 3. Logika Sorting (Terbaru / Terlama)
  filteredPosts.sort((a, b) => {
    const dateA = new Date(a.publishedAt || 0).getTime();
    const dateB = new Date(b.publishedAt || 0).getTime();
    return currentSort === "terlama" ? dateA - dateB : dateB - dateA;
  });

  // 4. Logika Paginasi (5 Item per Halaman)
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / ITEMS_PER_PAGE),
  );
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedPosts = filteredPosts.slice(
    (validCurrentPage - 1) * ITEMS_PER_PAGE,
    validCurrentPage * ITEMS_PER_PAGE,
  );

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
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12">
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
      </main>

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
