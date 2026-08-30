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
      media: "ogImage",
    },
    prepare({ language, media }) {
      return {
        title: `Home (${language?.toUpperCase() || "—"})`,
        media,
      };
    },
  },
});
