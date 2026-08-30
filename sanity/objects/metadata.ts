import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons/Image";

export default defineType({
    name: 'metadata',
    title: 'Metadata',
    type: 'object',
    icon: ImageIcon,
    fields: [
        defineField({
            name: "metaTitle",
            title: "Meta Title",
            type: "string",
        }),
        defineField({
            name: "metaDescription",
            title: "Meta Description",
            type: "text",
        }),
        defineField({
            name: "noIndex",
            title: "No Index",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "ogImage",
            title: "Open Graph Image - [1200x630]",
            type: "image",
        }),

    ],
})

