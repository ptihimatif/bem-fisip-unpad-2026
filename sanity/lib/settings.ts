import { cache } from "react";
import { sanityFetch } from "./live";
import { CONTENT_TERM, SITE_SETTINGS_QUERY } from "./queries";

export const getSiteSettings = cache(async () => {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY, params: { term: CONTENT_TERM }, perspective: "published", stega: false });
  return data;
});
