import Link from "next/link";

interface ArticleFilterSortProps {
  currentCategory: string;
  currentSort: string;
  buildUrl: (updates: {
    category?: string;
    sort?: string;
    page?: number;
  }) => string;
}

const getButtonClass = (isActive: boolean) =>
  `px-5 py-2.5 text-sm font-bold transition-colors ${
    isActive
      ? "bg-brand-yellow text-black pointer-events-none"
      : "bg-white/10 text-white hover:bg-white/20"
  }`;

export default function ArticleFilterSort({
  currentCategory,
  currentSort,
  buildUrl,
}: ArticleFilterSortProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex border border-white">
        <Link
          href={buildUrl({ category: "semua" })}
          className={getButtonClass(currentCategory === "semua")}
        >
          Semua
        </Link>
        <Link
          href={buildUrl({ category: "artikel" })}
          className={`border-l border-white ${getButtonClass(
            currentCategory === "artikel"
          )}`}
        >
          Artikel
        </Link>
        <Link
          href={buildUrl({ category: "kajian" })}
          className={`border-l border-white ${getButtonClass(
            currentCategory === "kajian"
          )}`}
        >
          Kajian
        </Link>
      </div>

      <div className="flex border border-white">
        <Link
          href={buildUrl({ sort: "terbaru" })}
          className={getButtonClass(currentSort === "terbaru")}
        >
          Terbaru
        </Link>
        <Link
          href={buildUrl({ sort: "terlama" })}
          className={`border-l border-white ${getButtonClass(
            currentSort === "terlama"
          )}`}
        >
          Terlama
        </Link>
      </div>
    </div>
  );
}
