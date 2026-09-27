import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import {
  CONTENT_TERM,
  SITEMAP_POSTS_QUERY,
  SITEMAP_UNITS_QUERY,
} from "@/sanity/lib/queries";

// The sitemap has no connected Sanity Live browser; fetch it at request time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://bemfisipunpad.com"
  ).replace(/\/$/, "");

  const params = { term: CONTENT_TERM };
  const [posts, units] = await Promise.all([
    client.fetch(SITEMAP_POSTS_QUERY, params, {
      perspective: "published",
      useCdn: false,
      cache: "no-store",
    }),
    client.fetch(SITEMAP_UNITS_QUERY, params, {
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
