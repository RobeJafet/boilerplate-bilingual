import {
    defineDocuments,
    defineLocations,
    PresentationPluginOptions,
  } from "sanity/presentation";
  
  export const resolve: PresentationPluginOptions["resolve"] = {
    mainDocuments: defineDocuments([
      {
        route: "/en",
        filter: `_type == 'home' && language == 'en'`,
      },
      {
        route: "/es",
        filter: `_type == 'home' && language == 'es'`,
      },
      {
        route: "/:lang/:slug",
        filter: `_type == "page" && slug.current == $slug && language == $lang`,
      },
    ]),
    locations: {
      home: defineLocations({
        select: {
          language: "language",
        },
        resolve: (doc) => ({
          locations: doc?.language
            ? [
                {
                  title: "Home",
                  href: `/${doc.language}`,
                },
              ]
            : [],
        }),
      }),
      page: defineLocations({
        select: {
          title: "title",
          slug: "slug.current",
          language: "language",
        },
        resolve: (doc) => ({
          locations: doc?.slug && doc?.language
            ? [
                {
                  title: doc.title || "Page",
                  href: `/${doc.language}/${doc.slug}`,
                },
              ]
            : [],
        }),
      }),
    },
  };
