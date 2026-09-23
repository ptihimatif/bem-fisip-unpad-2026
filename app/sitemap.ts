import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { CONTENT_TERM } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://bemfisipunpad.com";

  // Fetch all published posts for dynamic routes
  const { data: posts } = await sanityFetch({
    query: `*[_type == "post" && term == $term && defined(slug.current)]{
      "slug": slug.current,
      publishedAt,
      _updatedAt
    }`,
    params: { term: CONTENT_TERM },
    perspective: "published",
    stega: false,
  });

  // Fetch all organization units (birdep) for dynamic routes
  const { data: units } = await sanityFetch({
    query: `*[_type == "organizationUnit" && term == $term && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }`,
    params: { term: CONTENT_TERM },
    perspective: "published",
    stega: false,
  });

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/article`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hima`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  // Dynamic post routes
  const postRoutes = (Array.isArray(posts) ? posts : []).map((post: { slug: string; _updatedAt?: string; publishedAt?: string }) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: new Date(post._updatedAt || post.publishedAt || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Dynamic birdep routes
  const unitRoutes = (Array.isArray(units) ? units : []).map((unit: { slug: string; _updatedAt?: string }) => ({
    url: `${baseUrl}/penjelasan/${unit.slug}`,
    lastModified: new Date(unit._updatedAt || Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...routes, ...postRoutes, ...unitRoutes];
}
