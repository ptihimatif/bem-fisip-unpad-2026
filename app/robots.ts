import type { MetadataRoute } from "next";
import { resolveSiteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const { origin: baseUrl, indexable } = resolveSiteConfig();

  return {
    rules: {
      userAgent: "*",
      ...(indexable ? { allow: "/", disallow: ["/studio", "/api/"] } : { disallow: "/" }),
    },
    sitemap: indexable ? `${baseUrl}/sitemap.xml` : undefined,
  };
}
