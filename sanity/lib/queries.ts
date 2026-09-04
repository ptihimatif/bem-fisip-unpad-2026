import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`*[_type == "postan"] | order(publishedAt desc) {
  _id,
  judul,
  slug,
  postCategory,
  publishedAt,
  image,
  body,
  instagramUrl
}`);