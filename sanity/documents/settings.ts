import { defineField, defineType,  defineArrayMember } from "sanity";

export default defineType({
  name: "settings",
  type: "document",
  title: "Settings",
  fields: [
    defineField({
      name: "header",
      title: "Header",
      type: "object" as const,
      fields: [
        defineField({
          name: "links",
          type: "array" as const,
          title: "Links",
          of: [defineArrayMember({ type: "link" })],
        }),
      ],
    }),
    defineField({
      name: "footer",
      title: "Footer",
      type: "object" as const,
      fields: [
        defineField({
          name: "email",
          type: "string",
          title: "Email",
          validation: (rule) => rule.email(),
        }),
      ],
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
