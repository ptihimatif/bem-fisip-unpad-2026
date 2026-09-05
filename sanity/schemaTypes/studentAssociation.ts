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
    imageField("logo", "Official Logo"),
    httpsUrlField("officialLink", "Official Link", true),
    displayOrderField(),
  ],
  preview: { select: { title: "officialName", subtitle: "studyProgram", media: "logo" } },
});
