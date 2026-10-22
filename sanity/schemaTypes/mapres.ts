import { defineField, defineType } from "sanity";
import { displayOrderField, httpsUrlField, imageField, termField } from "./shared";

export const mapres = defineType({
  name: "mapres",
  title: "Mahasiswa Berprestasi",
  type: "document",
  fields: [
    termField(),
    defineField({ name: "nama_mapres", title: "Student Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "studyProgram", title: "Study Program", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "cohortYear", title: "Cohort Year", type: "number", validation: (rule) => rule.required().integer().min(2000).max(2100) }),
    defineField({ name: "rank", title: "Mapres Rank", type: "number", validation: (rule) => rule.integer().min(1).max(3) }),
    defineField({ name: "achievementTitle", title: "Achievement / Event", type: "string" }),
    defineField({ name: "achievementYear", title: "Achievement Year", type: "number", validation: (rule) => rule.integer().min(2000).max(2100) }),
    imageField("image", "Portrait"),
    httpsUrlField("instagramUrl", "Approved Profile URL"),
    displayOrderField(),
  ],
  preview: { select: { title: "nama_mapres", subtitle: "achievementTitle", media: "image" } },
});
