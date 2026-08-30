import { sanityFetch } from "@/sanity/lib/live";
import {
  HOME_METADATA,
  HOME_QUERY,
  PAGE_METADATA,
  PAGE_QUERY,
  PAGE_SLUG,
} from "@/sanity/query/page";
import { SETTINGS_QUERY, TRANSLATION_QUERY } from "@/sanity/utils/query";
import { locales } from "@/config/i18n/i18nConfig";

type HomeMetadata = {
  _id: string;
  _type: "home";
  metadata: Metadata;
};

type PageMetadata = {
  title?: string;
  metadata: Metadata;
};

export const fetchHomeMetadata = async (
  lang: LocalePage,
): Promise<HomeMetadata> => {
  const { data } = await sanityFetch({
    query: HOME_METADATA,
    params: { lang },
    stega: false,
  });
  return data as HomeMetadata;
};

export const fetchHome = async (lang: LocalePage): Promise<Home> => {
  const { data } = await sanityFetch({
    query: HOME_QUERY,
    params: { lang },
  });
  return data as Home;
};

export const fetchPageMetadata = async (
  slug: string,
  lang: LocalePage,
): Promise<PageMetadata> => {
  const { data } = await sanityFetch({
    query: PAGE_METADATA,
    params: { slug, lang },
    stega: false,
  });
  return data as PageMetadata;
};

export const fetchPage = async (
  slug: string,
  lang: LocalePage,
): Promise<Page> => {
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug, lang },
  });
  return data as Page;
};

export const fetchPageSlugs = async (): Promise<
  { lang: LocalePage; slug: string }[]
> => {
  const slugsArrays = await Promise.all(
    locales.map(async (locale) => {
      const { data } = await sanityFetch({
        query: PAGE_SLUG,
        params: { lang: locale },
        perspective: "published",
        stega: false,
      });

      const pages = (data ?? []) as { slug?: { current?: string } }[];

      return pages
        .filter((item) => item.slug?.current)
        .map((item) => ({
          lang: locale,
          slug: item.slug!.current!,
        }));
    }),
  );
  return slugsArrays.flat();
};

export const fetchSettings = async (lang: LocalePage): Promise<Settings> => {
  const { data } = await sanityFetch({
    query: SETTINGS_QUERY,
    params: { lang },
  });
  return data as Settings;
};

export const fetchTranslations = async (): Promise<Translation[]> => {
  const { data } = await sanityFetch({
    query: TRANSLATION_QUERY,
  });
  return (data ?? []) as Translation[];
};
