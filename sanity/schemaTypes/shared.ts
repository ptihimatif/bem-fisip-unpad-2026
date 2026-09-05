import { defineField } from "sanity";

export const CONTENT_TERM = "2026";

export function termField() {
  return defineField({
    name: "term",
    title: "Term",
    type: "string",
    initialValue: CONTENT_TERM,
    options: { list: [{ title: "2026", value: CONTENT_TERM }], layout: "radio" },
    validation: (rule) => rule.required(),
  });
}

export function displayOrderField() {
  return defineField({
    name: "displayOrder",
    title: "Display order",
    type: "number",
    validation: (rule) => rule.integer().min(0),
  });
}

export function imageField(name: string, title: string, required = false) {
  return defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alternative text",
        type: "string",
        validation: (rule) => rule.required().error("Describe the image for visitors who cannot see it."),
      }),
      defineField({ name: "attribution", title: "Attribution", type: "string" }),
    ],
    validation: required ? (rule) => rule.required() : undefined,
  });
}

export function httpsUrlField(name: string, title: string, required = false) {
  return defineField({
    name,
    title,
    type: "url",
    validation: (rule) => {
      const urlRule = rule.uri({ scheme: ["https"] });
      return required ? urlRule.required() : urlRule;
    },
  });
}
