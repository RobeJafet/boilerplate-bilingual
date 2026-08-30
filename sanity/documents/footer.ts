import { defineField, defineType } from "sanity";

export default defineType({
  name: "footer",
  type: "document",
  title: "Footer",
  fields: [
    defineField({
      name: "email",
      type: "string",
      title: "Email",
      validation: (rule) => rule.email(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Footer",
      };
    },
  },
})