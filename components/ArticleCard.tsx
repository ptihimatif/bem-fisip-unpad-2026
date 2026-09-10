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
      className="group relative flex min-h-60 w-full overflow-hidden bg-white text-black"
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-6">
        <div>
          <h3 className="text-[24px] font-bold group-hover:text-[#5a64b4]">
            {post.judul}
          </h3>
          {post.excerpt && (
            <p className="mt-5 mb-4 max-w-160 line-clamp-4 text-[16px] font-normal leading-tight wrap-break-word">
              {post.excerpt}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-base font-normal">
          <span
            className="px-1.5 py-0.5 font-semibold"
            style={{
              backgroundColor: isKajian ? "#8CFF00" : "#FFBA3A",
            }}
          >
            {categoryLabel}
          </span>
          {publicationDate && <span>- {publicationDate}</span>}
        </div>
      </div>
      <div className="relative hidden w-[min(33.33%,399px)] flex-none overflow-hidden sm:block">
        <SanityImage
          value={post.image}
          width={399}
          height={244}
          sizes="(min-width: 1024px) 399px, 33vw"
          fallbackAlt={`Gambar ${post.judul}`}
          className="h-full w-full object-cover transition-transform duration-500"
        />
      </div>
    </Link>
  );
}
