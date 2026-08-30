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
        "slug": slug.current,
        language
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
    "language": ^.language
`;

export const TRANSLATION_QUERY = groq`
*[_type == "translation.metadata"]{
  "type": coalesce(
    translations[language == "en"][0].value->_type,
    translations[_key == "en"][0].value->_type,
    schemaTypes[0]
  ),
  "en": {
    "slug": coalesce(
      translations[language == "en"][0].value->slug.current,
      translations[_key == "en"][0].value->slug.current
    )
  },
  "es": {
    "slug": coalesce(
      translations[language == "es"][0].value->slug.current,
      translations[_key == "es"][0].value->slug.current
    )
  }
}
`;

export const SETTINGS_QUERY = groq`
*[_type == "settings" && language == $lang][0] {
  headerLinks[]{
    ${LINK}
  },
  footerEmail
}
`;
