import { defineArrayMember, defineField, defineType } from "sanity";
import { CONTENT_TERM, httpsUrlField, imageField, termField } from "./shared";

export const SITE_SETTINGS_ID = `siteSettings-${CONTENT_TERM}`;

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    termField(),
    defineField({ name: "organizationName", title: "Organization Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "seoTitle", title: "Default SEO Title", type: "string", validation: (rule) => rule.max(60).warning("Keep this under 60 characters.") }),
    defineField({ name: "seoDescription", title: "Default SEO Description", type: "text", validation: (rule) => rule.max(160).warning("Keep this under 160 characters.") }),
    imageField("ogImage", "Default Open Graph Image"),
    defineField({ name: "officialEmail", title: "Official Email", type: "string", validation: (rule) => rule.email() }),
    defineField({ name: "officialAddress", title: "Official Address", type: "text" }),
    defineField({ name: "socialLinks", title: "Social Links", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "platform", title: "Platform", type: "string", validation: (rule) => rule.required() }), httpsUrlField("url", "Official URL", true)] })] }),
    httpsUrlField("fisipCareCenterUrl", "FISIP Care Center URL"),
    defineField({ name: "replaceDefaultSocialLinks", title: "Use only the social links above", type: "boolean", initialValue: false, description: "Enable after entering the complete approved list. Otherwise unspecified existing links remain as fallbacks." }),
  ],
  preview: { select: { title: "organizationName", subtitle: "term" } },
});
