import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";
import type { PUBLICATION_CARDS_QUERY_RESULT } from "@/sanity.types";

type ArticleCardProps = {
  post: PUBLICATION_CARDS_QUERY_RESULT[number];
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function ArticleCard({ post }: ArticleCardProps) {
  const isKajian = post.postCategory.toLowerCase().includes("kajian");
  const categoryLabel = isKajian ? "Kajian" : "Artikel";
  const publicationDate = post.publishedAt
    ? dateFormatter.format(new Date(post.publishedAt))
    : "";

  return (
    <Link
      href={`/post/${post.slug ?? post._id}`}
      className="group relative flex flex-col md:flex-row md:min-h-60 w-full overflow-hidden bg-white text-black shadow-sm transition-shadow hover:shadow-md"
    >
      {/* 1. Bagian Gambar */}
      <div className="relative flex-none w-full h-48 sm:h-56 md:h-auto overflow-hidden border-b border-gray-100 order-1 md:order-2 md:w-[min(40%,399px)] lg:w-[min(33.33%,399px)] md:border-b-0 md:border-l">
        <SanityImage
          value={post.image}
          width={800}
          height={450}
          sizes="(min-width: 768px) 399px, 100vw"
          fallbackAlt={`Gambar ${post.judul}`}
          className="h-full w-full object-cover group-hover:brightness-100 transition-brightness brightness-90 duration-300"
        />
      </div>

      {/* 2. Bagian Teks */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5 order-2 md:order-1">
        <div>
          {/* Judul: Lebih kecil di hp/tablet (text-lg/xl), normal kembali di md/lg ([24px]) */}
          <h2 className="text-lg sm:text-xl md:text-[24px] line-clamp-2 font-bold group-hover:text-brand-yellow transition-colors leading-snug">
            {post.judul}
          </h2>
          {post.excerpt && (
            <p className="mt-2 sm:mt-3 mb-4 lg:line-clamp-4 line-clamp-2 text-sm sm:text-sm md:text-md font-normal leading-relaxed warp-break-word text-gray-700">
              {post.excerpt}
            </p>
          )}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium">
          <span
            className="px-2 py-0.5 sm:py-1 font-semibold text-black text-xs"
            style={{
              backgroundColor: isKajian ? "#8CFF00" : "#FFBA3A",
            }}
          >
            {categoryLabel}
          </span>
          {publicationDate && (
            <span className="text-gray-600 text-xs">- {publicationDate}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
