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
    defineField({ name: "overview", title: "Overview", type: "array", of: [defineArrayMember({ type: "block" })] }),
    httpsUrlField("profileVideoUrl", "Profile Video URL"),
    defineField({ name: "vision", title: "Vision", type: "text" }),
    defineField({ name: "visionHighlights", title: "Vision phrase explanations", type: "array", description: "Exact phrases from Vision and their explanations; no automatic parsing of legacy content.", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "phrase", title: "Exact phrase", type: "string", validation: (rule) => rule.required() }), defineField({ name: "description", title: "Explanation", type: "text", validation: (rule) => rule.required() })] })] }),
    defineField({ name: "missionItems", title: "Mission cards", type: "array", description: "Structured cards used by the website. Existing string missions are retained for reference.", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", type: "string", validation: (rule) => rule.required() }), defineField({ name: "description", type: "text", validation: (rule) => rule.required() })] })] }),
    defineField({ name: "workCultureItems", title: "Work culture cards", type: "array", description: "Structured title and explanation. Legacy workCulture strings are retained.", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", type: "string", validation: (rule) => rule.required() }), defineField({ name: "description", type: "text", validation: (rule) => rule.required() })] })] }),
    defineField({ name: "logoExplanationItems", title: "Logo explanations on website", type: "array", description: "Updates copy for fixed logo pieces without changing the animation or assets.", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "elementKey", title: "Logo element", type: "string", options: { list: ["wave", "pendar", "mentari", "rays", "sun", "yellow", "blue", "synergy"] }, validation: (rule) => rule.required() }), defineField({ name: "title", type: "string", validation: (rule) => rule.required() }), defineField({ name: "description", type: "text", validation: (rule) => rule.required() })] })] }),
    defineField({ name: "missions", title: "Missions", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({
      name: "values",
      title: "Nilai",
      type: "array",
      of: [
        defineArrayMember({
          name: "cabinetValue",
          title: "Nilai",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Nama Nilai", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Penjelasan", type: "text", validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
    }),
    defineField({ name: "workCulture", title: "Work Culture Points", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "logoPhilosophy", title: "Logo Philosophy", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", title: "Element Name", type: "string", validation: (rule) => rule.required() }), defineField({ name: "description", title: "Description", type: "text", validation: (rule) => rule.required() })] })] }),
  ],
  preview: { select: { title: "cabinetName", subtitle: "term" } },
});
