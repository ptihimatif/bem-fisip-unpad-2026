import type { PortableTextBlock } from "next-sanity";

// Centralized Sanity Result Types
export interface Post {
  _id: string;
  judul: string;
  slug: { current: string };
  postCategory: string;
  publishedAt: string;
  image?: string;
  body?: PortableTextBlock[];
  instagramUrl?: string;
}
