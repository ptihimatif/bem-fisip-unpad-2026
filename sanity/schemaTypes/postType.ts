import { defineArrayMember, defineField, defineType } from "sanity";
import { displayOrderField, httpsUrlField, imageField, termField } from "./shared";

export const postType = defineType({
  name: "post",
  title: "Publication",
  type: "document",
  fields: [
    termField(),
    defineField({ name: "postCategory", title: "Category", type: "string", options: { list: [{ title: "Artikel", value: "artikel" }, { title: "Kajian", value: "kajian" }], layout: "radio" }, validation: (rule) => rule.required() }),
    defineField({ name: "judul", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "judul" }, validation: (rule) => rule.required() }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "excerpt", title: "Card Excerpt", type: "text", validation: (rule) => rule.max(240).warning("Keep this concise for cards.") }),
    imageField("image", "Cover Image"),
    defineField({ name: "body", title: "Body", type: "array", of: [defineArrayMember({ type: "block" })], validation: (rule) => rule.required() }),
    httpsUrlField("instagramUrl", "Official Instagram URL"),
    defineField({ name: "seoTitle", title: "SEO Title", type: "string", validation: (rule) => rule.max(60) }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text", validation: (rule) => rule.max(160) }),
    imageField("seoImage", "SEO Image"),
    defineField({ name: "isFeatured", title: "Featured", type: "boolean", initialValue: false }),
    displayOrderField(),
  ],
  preview: { select: { title: "judul", subtitle: "postCategory", media: "image" } },
});
