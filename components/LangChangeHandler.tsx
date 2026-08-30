"use client";

import { useEffect, useMemo } from "react";
import { locales } from "@/config/i18n/i18nConfig";
import { usePathname } from "next/navigation";
import Link from "next/link";

function getPathSegments(pathname: string) {
  return pathname.split("/").filter(Boolean);
}

function findTranslation(
  translations: Translation[] | undefined,
  slug: string,
  type?: string,
) {
  if (!slug || !translations?.length) return undefined;

  return translations.find((translation) => {
    if (type && translation.type !== type) return false;
    return translation.en?.slug === slug || translation.es?.slug === slug;
  });
}

function getTranslatedSlug(
  translations: Translation[] | undefined,
  slug: string,
  otherLang: LocalePage,
  type?: string,
) {
  return findTranslation(translations, slug, type)?.[otherLang]?.slug;
}

function getLocalizedHref(
  pathname: string,
  otherLang: LocalePage,
  translations: Translation[],
) {
  const segments = getPathSegments(pathname);
  if (segments.length <= 1) return `/${otherLang}`;

  const pageSlug = segments.slice(1).join("/");
  const targetSlug = getTranslatedSlug(
    translations,
    pageSlug,
    otherLang,
    "page",
  );
  if (!targetSlug) return `/${otherLang}`;
  return `/${otherLang}/${targetSlug}`;
}

export default function LangChangeHandler({
  lang,
  translations,
}: {
  lang: LocalePage;
  translations: Translation[];
}): React.ReactNode {
  const pathname = usePathname();
  const otherLang: LocalePage = lang === "en" ? "es" : "en";
  const newRoute = useMemo(
    () => getLocalizedHref(pathname, otherLang, translations),
    [pathname, otherLang, translations],
  );

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const otherLocale = locales.find((locale) => locale !== lang);

  return (
    <Link href={newRoute} className="uppercase" hrefLang={otherLang}>
      {otherLocale}
    </Link>
  );
}
