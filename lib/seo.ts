export const DEFAULT_ORGANIZATION_NAME = "BEM FISIP Unpad 2026";
export const DEFAULT_SOCIAL_IMAGE = "/assets/LOGO%20KABINET/logo-full.png";

/** JSON-LD is data, but a CMS string must never be able to close its script tag. */
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function publicationDescription(post: {
  seoDescription?: string | null;
  excerpt?: string | null;
  body?: readonly { children?: readonly { text?: string }[] }[] | null;
}) {
  const text = post.seoDescription?.trim() || post.excerpt?.trim() ||
    post.body?.map((block) => block.children?.map((child) => child.text ?? "").join("") ?? "").join(" ");
  return text?.replace(/\s+/g, " ").trim().slice(0, 200) || undefined;
}

export function publicationStructuredData({ origin, post, organizationName }: {
  origin: string;
  organizationName: string;
  post: {
    judul: string;
    slug: string | null;
    postCategory?: string | null;
    publishedAt?: string | null;
    _updatedAt?: string | null;
    excerpt?: string | null;
    image?: { asset?: { url?: string | null } | null } | null;
    seoImage?: { asset?: { url?: string | null } | null } | null;
  };
}) {
  const url = `${origin}/post/${encodeURIComponent(post.slug ?? "")}`;
  const image = post.seoImage?.asset?.url ?? post.image?.asset?.url;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: post.judul,
        description: post.excerpt || undefined,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        inLanguage: "id-ID",
        articleSection: post.postCategory === "kajian" ? "Kajian" : "Artikel",
        datePublished: post.publishedAt || undefined,
        dateModified: post._updatedAt || undefined,
        image: image ? [image] : undefined,
        publisher: { "@type": "Organization", "@id": `${origin}/#organization`, name: organizationName, url: origin },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: organizationName, item: origin },
          { "@type": "ListItem", position: 2, name: "Artikel dan Kajian", item: `${origin}/article` },
          { "@type": "ListItem", position: 3, name: post.judul, item: url },
        ],
      },
    ],
  };
}
