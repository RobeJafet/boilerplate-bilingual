import { sectionSchemas } from "@/sections/registry";
import home from "../documents/home";
import page from "../documents/page";
import metadata from "../objects/metadata";
import imageComponent from "../objects/image";
import link from "../objects/link";
import header from "../documents/header";
import footer from "../documents/footer";

const objects = [
  metadata,
  imageComponent,
  link,
]

const documents = [
  home,
  page,
  header,
  footer,
]

export const schema = [
  ...objects,
  ...documents,
  ...sectionSchemas,
]

