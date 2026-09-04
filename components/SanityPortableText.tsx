import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";

// Centralized custom components for rendering PortableText across the application
export const customComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="text-3xl font-extrabold text-blue-600 mt-6 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold text-blue-500 mt-5 mb-3">{children}</h2>,
    normal: ({ children }) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 bg-blue-50 py-2 my-4 rounded-r-md">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-700">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-gray-700">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
    em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http") ? "_blank" : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-blue-600 underline hover:text-blue-800 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
};

interface SanityPortableTextProps {
  blocks: PortableTextBlock[];
}

export function SanityPortableText({ blocks }: SanityPortableTextProps) {
  return <PortableText value={blocks} components={customComponents} />;
}
