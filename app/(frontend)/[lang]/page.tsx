import { PageTransitionLoader } from "@/components/PageTransitionLoader";
import Sections from "@/components/Sections";
import { locales } from "@/config/i18n/i18nConfig";
import { generatePageMetadata } from "@/lib/generateMetadata";
import { fetchHome, fetchHomeMetadata } from "@/sanity/services/fetchPage";

export async function generateStaticParams() {
    return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: LocalePage }>;
}) {
    const { lang } = await params;
    const home = await fetchHomeMetadata(lang);
    return generatePageMetadata({
        metadata: home?.metadata,
        slug: "home",
        title: "Home",
        lang,
    });
}

export default async function Home({
    params,
}: {
    params: Promise<{ lang: LocalePage }>;
}) {
    const { lang } = await params;
    const home = await fetchHome(lang);

    return(
        <main>
            <PageTransitionLoader />
            <Sections sections={home?.sections} />
        </main>
    );
}
