import { defineArrayMember, defineField, defineType } from "sanity";
import { CONTENT_TERM, displayOrderField, httpsUrlField, imageField, termField } from "./shared";

export const program = defineType({
  name: "program",
  title: "Program",
  type: "document",
  fields: [
    termField(),
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (rule) => rule.required() }),
    defineField({ name: "shortDescription", title: "Short Description", type: "text", validation: (rule) => rule.max(240).warning("Keep this concise for cards.") }),
    defineField({ name: "description", title: "Full Description", type: "array", of: [defineArrayMember({ type: "block" })] }),
    imageField("coverImage", "Cover Image"),
    defineField({ name: "organizationUnit", title: "Owning Organization Unit", type: "reference", to: [{ type: "organizationUnit" }], options: { filter: ({ document }) => ({ filter: "term == $term", params: { term: document?.term ?? CONTENT_TERM } }) }, validation: (rule) => rule.required() }),
    defineField({ name: "isFeatured", title: "Featured", type: "boolean", initialValue: false }),
    displayOrderField(),
    defineField({ name: "startDate", title: "Start Date", type: "date" }),
    defineField({ name: "endDate", title: "End Date", type: "date", validation: (rule) => rule.custom((endDate, context) => { const startDate = context.document?.startDate; return !startDate || !endDate || endDate >= startDate || "End date must be on or after the start date."; }) }),
    httpsUrlField("externalLink", "Official External Link"),
  ],
  preview: { select: { title: "name", subtitle: "shortDescription", media: "coverImage" } },
});
