import { getDictionary } from "@/config/i18n/dictionaries";
import { I18nProvider } from "@/config/i18n/i18nProvider";
import { locales } from "@/config/i18n/i18nConfig";
import { fetchTranslations } from "@/sanity/services/fetchPage";
import LangChangeHandler from "@/components/LangChangeHandler";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
    children,
    params,
}: {
    readonly children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    if (!locales.includes(lang as LocalePage)) {
        notFound();
    }

    const locale = lang as LocalePage;
    const dict = await getDictionary(locale);
    const translations = await fetchTranslations();

    return (
        <I18nProvider lang={locale} dict={dict}>
            <div className="fixed top-4 right-4 z-50">
                <LangChangeHandler
                    lang={locale}
                    translations={translations || []}
                />
            </div>
            {children}
        </I18nProvider>
    );
}
