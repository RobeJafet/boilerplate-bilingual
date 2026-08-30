import { sectionSchemas } from "@/sections/registry";
import home from "../documents/home";
import page from "../documents/page";
import metadata from "../objects/metadata";
import imageComponent from "../objects/image";
import link from "../objects/link";
import settings from "../documents/settings";

const objects = [
  metadata,
  imageComponent,
  link,
]

const documents = [
  home,
  page,
  settings,
]

export const schema = [
  ...objects,
  ...documents,
  ...sectionSchemas,
]

