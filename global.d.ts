interface Asset {
  _id: string;
  metadata: {
    dimensions: {
      width: number;
      height: number;
      aspectRatio: number;
    };
    blurHash: string;
  }
}

type Image = {
    _key: string;
    alt: string;
    asset: Asset;
    hotspot?: { x: number; y: number; height: number; width: number };
};


type InternalLink = {
  _type: string;
  slug: string;
};

type Link = {
  _type?: "link";
  _key?: string;
  linkType: string;
  href?: string;
  label?: string;
  page?: InternalLink;
  inNewTab?: boolean;
  children: React.ReactNode;
  className?: string;
  onClickAction?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

type Metadata = {
  metaTitle: string;
  metaDescription?: string;
  ogImage?: Image;
  noIndex: boolean;
};

type Page ={
  readonly _type: "page";
  title?: string;
  slug?: { current: string };
  sections?: Section[];
  metadata?: Metadata;
};

type Home =  {
  readonly _type: "home";
  metadata?: Metadata;
  sections?: Section[];
};

type SectionModule<TProps = unknown> = {
  name: string;                         
  schema: SchemaTypeDefinition;          
  query: string;                         
  Component: ComponentType<TProps>;
  usableIn: ReadonlyArray<"home" | "page">; 
};