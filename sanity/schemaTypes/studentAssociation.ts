import { defineField, defineType } from "sanity";
import { displayOrderField, httpsUrlField, imageField, termField } from "./shared";

export const studentAssociation = defineType({
  name: "studentAssociation",
  title: "Student Association (Himpunan / Huria)",
  type: "document",
  fields: [
    termField(),
    defineField({ name: "officialName", title: "Official Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "abbreviation", title: "Abbreviation", type: "string" }),
    defineField({ name: "studyProgram", title: "Study Program", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "cabinetName", title: "Cabinet Name", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    imageField("logo", "Official Logo"),
    httpsUrlField("officialLink", "Official Link (Legacy)", true),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineField({
          name: "socialLink",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: ["instagram", "tiktok", "youtube", "linkedin", "x", "line", "website"],
              },
              validation: (rule) => rule.required(),
            }),
            httpsUrlField("url", "URL", false),
          ],
        }),
      ],
    }),
    displayOrderField(),
  ],
  preview: { select: { title: "officialName", subtitle: "studyProgram", media: "logo" } },
});
