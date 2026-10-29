export const PUBLICATIONS_PER_PAGE = 5;

export function publicationFilters(params: Record<string, string | string[] | undefined>) {
  const category = typeof params.category === "string" ? params.category.toLowerCase() : "semua";
  const sort = typeof params.sort === "string" ? params.sort.toLowerCase() : "terbaru";
  const page = typeof params.page === "string" && /^\d+$/.test(params.page) ? Number(params.page) : 1;
  return {
    category: ["artikel", "kajian"].includes(category) ? category : "semua",
    sort: sort === "terlama" ? "terlama" : "terbaru",
    page: Number.isSafeInteger(page) && page > 0 && Number.isSafeInteger(page * PUBLICATIONS_PER_PAGE) ? page : 1,
  };
}

/** Each archive page has its own canonical; tracking and default filters are omitted. */
export function publicationCanonical(filters: ReturnType<typeof publicationFilters>) {
  const params = new URLSearchParams();
  if (filters.category !== "semua") params.set("category", filters.category);
  if (filters.sort !== "terbaru") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  const query = params.toString();
  return `/article${query ? `?${query}` : ""}`;
}
