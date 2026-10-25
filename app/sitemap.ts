import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { resolveSiteConfig } from "@/lib/site-config";
import { isSanityTestMode } from "@/sanity/env";
import { fixtureData } from "@/sanity/lib/test-fixtures";
import type { SITEMAP_POSTS_QUERY_RESULT, SITEMAP_UNITS_QUERY_RESULT } from "@/sanity.types";
import {
  CONTENT_TERM,
  SITEMAP_POSTS_QUERY,
  SITEMAP_UNITS_QUERY,
} from "@/sanity/lib/queries";

// The sitemap has no connected Sanity Live browser; fetch it at request time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { origin: baseUrl } = resolveSiteConfig();

  const params = { term: CONTENT_TERM };
  const [posts, units] = await Promise.all([
    isSanityTestMode ? Promise.resolve(fixtureData(SITEMAP_POSTS_QUERY) as SITEMAP_POSTS_QUERY_RESULT) : client.fetch(SITEMAP_POSTS_QUERY, params, {
      perspective: "published",
      useCdn: false,
      cache: "no-store",
    }),
    isSanityTestMode ? Promise.resolve(fixtureData(SITEMAP_UNITS_QUERY) as SITEMAP_UNITS_QUERY_RESULT) : client.fetch(SITEMAP_UNITS_QUERY, params, {
      perspective: "published",
      useCdn: false,
      cache: "no-store",
    }),
  ]);

  // Static routes
  const routes = [
    {
      url: baseUrl,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/article`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hima`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  // Dynamic post routes
  const postRoutes = (posts ?? []).map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: post._updatedAt || post.publishedAt || undefined,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Dynamic birdep routes
  const unitRoutes = (units ?? []).map((unit) => ({
    url: `${baseUrl}/penjelasan/${unit.slug}`,
    lastModified: unit._updatedAt || undefined,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...routes, ...postRoutes, ...unitRoutes];
}
