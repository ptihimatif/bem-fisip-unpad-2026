import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";
import { safeExternalUrl } from "@/sanity/lib/urls";

// Centralized custom components for rendering PortableText across the application
function buildComponents(paragraphClassName?: string): PortableTextComponents {
  return {
    block: {
      h1: ({ children }) => <h1 className="text-3xl font-extrabold text-white mt-6 mb-4">{children}</h1>,
      h2: ({ children }) => <h2 className="text-2xl font-bold text-white mt-5 mb-3">{children}</h2>,
      normal: ({ children }) => (
        <p className={paragraphClassName ?? "text-white leading-relaxed mb-4"}>
          {children}
        </p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-white/30 bg-white/10 p-4 italic text-white my-4">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1 text-white">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-white">{children}</ol>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
      em: ({ children }) => <em className="italic text-white/90">{children}</em>,
      link: ({ value, children }) => {
        const href = safeExternalUrl(value?.href);
        if (!href) return <>{children}</>;
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-yellow underline hover:text-[#ffd27a] transition-colors"
          >
            {children}
          </a>
        );
      },
    },
  };
}

interface SanityPortableTextProps {
  blocks: PortableTextBlock[];
  className?: string;
}

export function SanityPortableText({ blocks, className }: SanityPortableTextProps) {
  return <PortableText value={blocks} components={buildComponents(className)} />;
}
