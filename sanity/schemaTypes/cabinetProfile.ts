import { defineArrayMember, defineField, defineType } from "sanity";
import { CONTENT_TERM, httpsUrlField, termField } from "./shared";

export const CABINET_PROFILE_ID = `cabinetProfile-${CONTENT_TERM}`;

export const cabinetProfile = defineType({
  name: "cabinetProfile",
  title: "Cabinet Profile",
  type: "document",
  fields: [
    termField(),
    defineField({ name: "cabinetName", title: "Cabinet Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "overview", title: "Overview", type: "array", of: [defineArrayMember({ type: "block" })] }),
    httpsUrlField("profileVideoUrl", "Profile Video URL"),
    defineField({ name: "vision", title: "Vision", type: "text" }),
    defineField({ name: "missions", title: "Missions", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "values", title: "Values", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "workCulture", title: "Work Culture Points", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "logoPhilosophy", title: "Logo Philosophy", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", title: "Element Name", type: "string", validation: (rule) => rule.required() }), defineField({ name: "description", title: "Description", type: "text", validation: (rule) => rule.required() })] })] }),
  ],
  preview: { select: { title: "cabinetName", subtitle: "term" } },
});
