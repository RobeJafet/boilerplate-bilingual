import {
    defineDocuments,
    defineLocations,
    PresentationPluginOptions,
  } from "sanity/presentation";
  
  export const resolve: PresentationPluginOptions["resolve"] = {
    mainDocuments: defineDocuments([
      {
        route: "/",
        filter: `_type == 'home'`,
      },
      {
        route: "/:slug",
        filter: `_type == "page" && slug.current == $slug`,
      },
    ]),
    locations: {
      service: defineLocations({
        select: {
          title: "title",
          slug: "slug.current",
        },
        resolve: (doc) => ({
          locations: doc?.slug
            ? [
                {
                  title: doc.title || "Page",
                  href: `/${doc.slug}`,
                },
              ]
            : [],
        }),
      }),
    },
  };
  