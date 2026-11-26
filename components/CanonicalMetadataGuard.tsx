"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Keep client-side route transitions in sync with the page's server metadata. */
export default function CanonicalMetadataGuard() {
  const pathname = usePathname();

  useEffect(() => {
    const syncCanonical = () => {
      const pageUrls = Array.from(
        document.head.querySelectorAll<HTMLMetaElement>(
          'meta[property="og:url"][content]',
        ),
      ).filter((meta) => {
        try {
          return new URL(meta.content, window.location.origin).pathname === pathname;
        } catch {
          return false;
        }
      });
      const pageUrl = pageUrls.at(-1)?.content;
      if (!pageUrl) return;

      const canonicalUrl = new URL(pageUrl, window.location.origin).href;
      const canonicalLinks = Array.from(
        document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'),
      );
      const canonicalLink = canonicalLinks[0] ?? document.createElement("link");
      if (canonicalLink.rel !== "canonical") canonicalLink.rel = "canonical";
      if (canonicalLink.href !== canonicalUrl) canonicalLink.href = canonicalUrl;
      if (!canonicalLink.isConnected) document.head.append(canonicalLink);
      for (const staleLink of canonicalLinks.slice(1)) staleLink.remove();
    };

    syncCanonical();
    const observer = new MutationObserver(syncCanonical);
    observer.observe(document.head, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["content", "href"],
    });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
