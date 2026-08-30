import "server-only";

import { defaultLocale } from "./i18nConfig";

const dictionaries = {
  en: () => import("../dictionaries/en.json").then((module) => module.default),
  es: () => import("../dictionaries/es.json").then((module) => module.default),
};

export const getDictionary = async (locale: LocalePage) =>
  dictionaries[locale]?.() ?? dictionaries[defaultLocale]();
