import { sectionsForDocument } from "@/sections/registry";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  type: "document",
  title: "Page",
  fields: [
    ...sectionsForDocument("page"),
    defineField({
      name: "metadata",
      type: "metadata",
      title: "Metadata",
    }),
  ],
  preview: {
    select: {
      media: "ogImage",
    },
    prepare({ media }) {
      return {
        title: `Page`,
        media: media,
      };
    },
  },
});