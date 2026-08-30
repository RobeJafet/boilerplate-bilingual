import { defineField, defineType } from "sanity";

export default defineType({
  name: "settings",
  type: "document",
  title: "Settings",
  fieldsets: [
    {
      name: "header",
      title: "Header",
      options: {
        collapsible: false,
        collapsed: false,
      },
    },
    {
      name: "footer",
      title: "Footer",
      options: {
        collapsible: false,
        collapsed: false,
      },
    },
  ],
  fields: [
    defineField({
      name: "headerLinks",
      type: "array" as const,
      title: "Header Links",
      of: [{ type: "link" }],
      fieldset: "header",
    }),
    defineField({
      name: "footerEmail",
      type: "string",
      title: "Footer Email",
      validation: (rule) => rule.email(),
      fieldset: "footer",
    }),
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      language: "language",
    },
    prepare({ language }) {
      return {
        title: `Settings (${language?.toUpperCase() || "—"})`,
      };
    },
  },
});
