import { groq } from "next-sanity";

export const IMG = groq`
    _key,
    alt,
    "asset": image.asset->{
        _id,
        metadata {
          dimensions,
          blurHash
        }
      },
    "hotspot": image.hotspot{
        x, y
    }
`;

export const LINK = groq`
    _key,
    linkType,
    label,
    linkType == 'href' => {
      "href": href,
      inNewTab
    },
    linkType == 'page' => {
      "page": page->{
        _type,
        "slug": slug.current
      }
    }
`;


export const METADATA = groq`
    metaTitle,
    metaDescription,
    noIndex,
    ogImage {
      asset->{
        _id,
        metadata {
          dimensions
        }
      }
    },
`;
