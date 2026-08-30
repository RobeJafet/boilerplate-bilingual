import { groq } from "next-sanity";
import { METADATA } from "@/sanity/utils/query";
import { sectionQueriesForDocument } from "@/sections/registry";

function sectionsProjection(doc: "home" | "page") {
  const queries = sectionQueriesForDocument(doc);
  return queries ? `sections[] {\n    ${queries}\n  },` : "";
}

export const HOME_METADATA = groq`
  *[_type == "home"][0] {
    _id,
    _type,
    metadata{
      ${METADATA}
    },
  }
`;

export const HOME_QUERY = groq`
  *[_type == "home"][0] {
    _id,
    _type,
    ${sectionsProjection("home")}
    metadata{
      ${METADATA}
    },
  }
`;
