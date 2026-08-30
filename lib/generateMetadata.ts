// lib/generateMetadata.ts

// This utility generates Next.js metadata for SEO and social sharing.
// It creates meta tags including page title, description, Open Graph images,
// robots directives, and canonical URLs based on Sanity CMS content.
// Falls back to default values when content is not available.

// COMMENT: CHANGE OG IMAGE IN PUBLIC/IMAGES/OG-IMAGE.JPG TO CHANGE DEFAULT OG IMAGE

import { urlFor } from "@/sanity/lib/image";
import { isLive } from "@/sanity/env";

const isProduction = isLive === "production";

export function generatePageMetadata({
  metadata,
  slug,
  title,
  lang,
}: {
  metadata?: Metadata;
  slug?: string;
  title?: string;
  lang?: LocalePage;
}) {
  const language = metadata?.language || lang;

  return {
    title: metadata?.metaTitle || title || "Title Undefined",
    description: metadata?.metaDescription,
    openGraph: {
      images: [
        {
          url: metadata?.ogImage
            ? urlFor(metadata?.ogImage).width(400).fit("max").format("webp").url()
            : `${process.env.NEXT_PUBLIC_SITE_URL}/images/og-image.jpg`,
          width: metadata?.ogImage?.asset?.metadata?.dimensions?.width || 1200,
          height: metadata?.ogImage?.asset?.metadata?.dimensions?.height || 630,
        },
      ],
      type: "website",
      locale: language,
    },
    robots: !isProduction
      ? "noindex, nofollow"
      : metadata?.noIndex
        ? "noindex"
        : "index, follow",
   alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${language}${slug === 'home' || !slug ? "" : `/${slug}`}`,
    },
  };
}
