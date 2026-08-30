import type {StructureResolver} from "sanity/structure";
import {SINGLETONS} from "@/config/singletons/singletons";
import { LANGUAGES } from "@/config/i18n/i18nConfig";
import { DocumentIcon } from "@sanity/icons/Document";
import { apiVersion } from "./env";

const singletonTypeNames = new Set(SINGLETONS.map((s) => s._type));
const hiddenFromDefaultList = new Set([
  ...singletonTypeNames,
  "page",
  "translation.metadata",
]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...SINGLETONS.map((singleton) =>
        singleton.localized
          ? S.listItem()
              .title(singleton.title)
              .id(singleton.id)
              .child(
                S.list()
                  .title(singleton.title)
                  .id(singleton.id)
                  .items(
                    LANGUAGES.map((language) =>
                      S.documentListItem()
                        .schemaType(singleton._type)
                        .id(`${singleton.id}-${language.id}`)
                        .title(
                          `${singleton.title} (${language.id.toLocaleUpperCase()})`,
                        ),
                    ),
                  )
                  .canHandleIntent(
                    (intentName, params) =>
                      intentName === "edit" &&
                      params.id.startsWith(singleton.id),
                  ),
              )
          : S.listItem()
              .title(singleton.title)
              .id(singleton.id)
              .child(
                S.document()
                  .schemaType(singleton._type)
                  .documentId(singleton.id)
                  .title(singleton.title),
              ),
      ),
      S.listItem()
        .title("Pages (EN)")
        .id("pages-en")
        .icon(DocumentIcon)
        .child(
          S.documentList()
            .title("Pages (EN)")
            .filter('_type == "page" && language == "en"')
            .apiVersion(apiVersion)
            .initialValueTemplates([
              S.initialValueTemplateItem("page-en"),
            ]),
        ),
      S.listItem()
        .title("Pages (ES)")
        .id("pages-es")
        .icon(DocumentIcon)
        .child(
          S.documentList()
            .title("Pages (ES)")
            .filter('_type == "page" && language == "es"')
            .apiVersion(apiVersion)
            .initialValueTemplates([
              S.initialValueTemplateItem("page-es"),
            ]),
        ),
      ...S.documentTypeListItems().filter(
        (item) => !hiddenFromDefaultList.has(item.getId()!),
      ),
    ]);
