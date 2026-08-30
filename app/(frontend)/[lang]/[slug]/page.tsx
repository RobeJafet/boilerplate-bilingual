import { PageTransitionLoader } from "@/components/PageTransitionLoader";
import Sections from "@/components/Sections";
import { generatePageMetadata } from "@/lib/generateMetadata";
import { fetchPage, fetchPageMetadata, fetchPageSlugs } from "@/sanity/services/fetchPage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return fetchPageSlugs();
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: LocalePage; slug: string }>;
}): Promise<Metadata> {
    const { lang, slug } = await params;
    const page = await fetchPageMetadata(slug, lang);
    if (page?.metadata) {
        return generatePageMetadata({
            metadata: page.metadata,
            slug,
            title: page.title,
            lang,
        });
    }
    return {
        title: page?.title || "Title Undefined",
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ lang: LocalePage; slug: string }>;
}) {
    const { lang, slug } = await params;
    const page = await fetchPage(slug, lang);

    if (!page) {
        notFound();
    }

    return (
        <main>
            <PageTransitionLoader />
            <Sections sections={page.sections} />
        </main>
    );
}
