import type {StructureResolver} from "sanity/structure";
import {SINGLETONS} from "@/config/singletons/singletons";

const singletonTypeNames = new Set(SINGLETONS.map((s) => s._type));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...SINGLETONS.map((singleton) =>
        S.documentListItem()
          .id(singleton.id)
          .schemaType(singleton._type)
          .title(singleton.title),
      ),
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypeNames.has(item.getId()!),
      ),
    ]);
