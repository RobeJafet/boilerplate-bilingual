import { sectionsForDocument } from "@/sections/registry";
import { isUniqueOtherThanLanguage } from "@/sanity/lib/isUnique";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  type: "document",
  title: "Page",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        isUnique: isUniqueOtherThanLanguage,
        source: "title",
        maxLength: 96,
        documentInternationalization: {
          exclude: true,
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    ...sectionsForDocument("page"),
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
      title: "title",
      media: "ogImage",
    },
    prepare({ language, media, title }) {
      return {
        title: `${title || "Page"} (${language?.toUpperCase() || "—"})`,
        media,
      };
    },
  },
});
