import { defineArrayMember, defineField, defineType } from "sanity";
import { displayOrderField, httpsUrlField, imageField, termField } from "./shared";

export const organizationUnit = defineType({
  name: "organizationUnit",
  title: "Organization Unit",
  type: "document",
  fields: [
    termField(),
    defineField({ name: "officialName", title: "Official Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "abbreviation", title: "Abbreviation", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "officialName" }, validation: (rule) => rule.required() }),
    defineField({ name: "unitKind", title: "Unit Kind", type: "string", options: { list: [{ title: "Biro", value: "biro" }, { title: "Departemen", value: "departemen" }], layout: "radio" }, validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", validation: (rule) => rule.required() }),
    imageField("coverImage", "Cover Image"),
    displayOrderField(),
    defineField({ name: "gallery", title: "Gallery Images", type: "array", of: [defineArrayMember({ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alternative text", type: "string", validation: (rule) => rule.required() }), defineField({ name: "caption", title: "Caption", type: "string" })] })] }),
    defineField({ name: "contactLinks", title: "Contact / Social Links", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "platform", type: "string", validation: (rule) => rule.required() }), httpsUrlField("url", "Official URL", true)] })] }),
  ],
  preview: { select: { title: "officialName", subtitle: "unitKind", media: "coverImage" } },
});
