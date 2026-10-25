import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";
import { safeExternalUrl } from "@/sanity/lib/urls";

// Centralized custom components for rendering PortableText across the application
function buildComponents(paragraphClassName?: string, tone: "dark" | "light" = "dark"): PortableTextComponents {
  const text = tone === "light" ? "text-[#000c23]" : "text-white";
  return {
    block: {
      h1: ({ children }) => <h1 className={`text-3xl font-extrabold ${text} mt-6 mb-4`}>{children}</h1>,
      h2: ({ children }) => <h2 className={`text-2xl font-bold ${text} mt-5 mb-3`}>{children}</h2>,
      normal: ({ children }) => (
        <p className={paragraphClassName ?? `${text} leading-relaxed mb-4`}>
          {children}
        </p>
      ),
      blockquote: ({ children }) => (
        <blockquote className={`border-l-4 ${tone === "light" ? "border-brand-blue/30 bg-brand-blue/5" : "border-white/30 bg-white/10"} p-4 italic ${text} my-4`}>
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className={`list-disc pl-6 mb-4 space-y-1 ${text}`}>{children}</ul>,
      number: ({ children }) => <ol className={`list-decimal pl-6 mb-4 space-y-1 ${text}`}>{children}</ol>,
    },
    marks: {
      strong: ({ children }) => <strong className={`font-bold ${text}`}>{children}</strong>,
      em: ({ children }) => <em className={`italic ${text}`}>{children}</em>,
      link: ({ value, children }) => {
        const href = safeExternalUrl(value?.href);
        if (!href) return <>{children}</>;
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${tone === "light" ? "text-brand-blue hover:text-brand-blue/80" : "text-brand-yellow hover:text-[#ffd27a]"} underline transition-colors`}
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
  tone?: "dark" | "light";
}

export function SanityPortableText({ blocks, className, tone }: SanityPortableTextProps) {
  return <PortableText value={blocks} components={buildComponents(className, tone)} />;
}
