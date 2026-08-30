import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons/Image";


export default defineType({
    name: 'imageComponent',
    title: 'Image Component',
    type: 'object',
    icon: ImageIcon,
    fields: [
        defineField({
            name: "image",
            title: "Image",
            type: "image",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "alt",
            title: "Alt",
            type: "string",
        }),
        defineField({
            name: "caption",
            title: "Caption",
            type: "text",
        }),

    ],
})