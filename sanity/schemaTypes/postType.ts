import { defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post", 
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "postCategory",
      title: "Tipe Post",
      type: "string",
      options: {
        list: [
          { title: "Artikel", value: "artikel" },
          { title: "Kajian", value: "kajian" }
        ],
        layout: "radio"
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "judul",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "judul" },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "image",
      type: "image"
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }]
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      description:
        "Paste the full link (e.g., https://www.instagram.com/username)",
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: "judul",
      subtitle: "postCategory",
      media: "image"
    }
  }
});
