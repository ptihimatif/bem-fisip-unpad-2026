import { defineField, defineType } from "sanity";
import {
  CONTENT_TERM,
  displayOrderField,
  httpsUrlField,
  imageField,
  termField
} from "./shared";

export const member = defineType({
  name: "member",
  title: "Member",
  type: "document",
  fields: [
    termField(),
    defineField({
      name: "name",
      title: "Approved Public Name",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "role",
      title: "Role / Position",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "organizationUnit",
      title: "Organization Unit",
      type: "reference",
      to: [{ type: "organizationUnit" }],
      options: {
        filter: ({ document }) => ({
          filter: "term == $term",
          params: { term: document?.term ?? CONTENT_TERM }
        })
      },
      validation: (rule) => rule.required()
    }),
    imageField("photo", "Photograph"),
    displayOrderField(),
    httpsUrlField("socialLink", "Official Social Link"),
    defineField({
      name: "isLeader",
      title: "Leadership / Featured Flag",
      type: "boolean",
      initialValue: false
    })
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } }
});
