import { sectionsForDocument } from "@/sections/registry";
import { defineField, defineType } from "sanity";



export default defineType({
  name: "home",
  type: "document",
  title: "Home Page",
  fields: [
    ...sectionsForDocument("home"),
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
        title: `Home`,
        media: media,
      };
    },
  },
});