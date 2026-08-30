import { PageTransitionLoader } from "@/components/PageTransitionLoader";
import Sections from "@/components/Sections";
import { generatePageMetadata } from "@/lib/generateMetadata";
import { fetchHome, fetchHomeMetadata } from "@/sanity/services/fetchPage";

export async function generateMetadata() {
    const home = await fetchHomeMetadata();
    return generatePageMetadata(
        {
            metadata: home.metadata,
            slug: "home",
            title: "Home",
        }
    );
}

export default async function Home() {
    const home = await fetchHome();

    return(
        <main>
            <PageTransitionLoader />
            <Sections sections={home?.sections} />
        </main>
    );
}