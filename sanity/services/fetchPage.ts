import { sanityFetch } from "@/sanity/lib/live";
import { HOME_METADATA, HOME_QUERY } from "@/sanity/query/page";

type HomeMetadata = {
  _id: string;
  _type: "home";
  metadata: Metadata;
};

export const fetchHomeMetadata = async (): Promise<HomeMetadata> => {
  const { data } = await sanityFetch({
    query: HOME_METADATA,
    stega: false,
  });
  return data as HomeMetadata;
};

export const fetchHome = async (): Promise<Home> => {
  const { data } = await sanityFetch({
    query: HOME_QUERY,
  });
  return data as Home;
};
