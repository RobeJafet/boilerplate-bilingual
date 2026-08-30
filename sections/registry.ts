import { defineArrayMember, defineField } from "sanity";

export const SECTIONS = [

] as const satisfies readonly SectionModule[];

export type SectionName = (typeof SECTIONS)[number]["name"];
type SectionDocument = SectionModule["usableIn"][number];

function modulesForDocument(doc: SectionDocument) {
  const sections: readonly SectionModule[] = SECTIONS;

  return sections.filter((s) => s.usableIn.includes(doc));
}

export const sectionSchemas = (
  SECTIONS as readonly SectionModule[]
).map((s) => s.schema);

export function sectionsForDocument(doc: SectionDocument) {
  const sections = modulesForDocument(doc);

  if (sections.length === 0) {
    return [];
  }

  return [
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: sections.map((s) => defineArrayMember({ type: s.name })),
    }),
  ];
}

export function sectionQueriesForDocument(doc: SectionDocument) {
  return modulesForDocument(doc)
    .map((s) => s.query)
    .join(",\n");
}
