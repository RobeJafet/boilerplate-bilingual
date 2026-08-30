import { SECTIONS } from "./registry";

type PropsOf<M> = M extends SectionModule<infer P> ? P : never;
type RegisteredSection = PropsOf<(typeof SECTIONS)[number]>;
type BoilerplateSection = {
    _type: string;
    _key?: string;
    [key: string]: unknown;
};

export type Section = [RegisteredSection] extends [never]
    ? BoilerplateSection
    : RegisteredSection;

export type SectionMap = {
    [K in Section["_type"]]: React.FC<Extract<Section, { _type: K }>>;
  };