import { defineField, defineType } from "sanity";

export default defineType({
  name: "header",
  type: "document",
  title: "Header",
  fields: [
    defineField({
        name: "links",
        type: "array" as const,
        title: "Links",
        of: [{ type: "link" }],
    }),
   
  ],
  preview: {
    prepare() {
      return {
        title: "Header",
      };
    },
  },
})