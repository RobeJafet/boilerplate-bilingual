import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { Toaster } from "sonner";
import DisableDraftMode from "@/components/DisableDraftMode";
import { DraftModeProvider } from "@/components/DraftModeProvider";
import {PageTransitionHandler} from "@/components/PageTransitionHandler";

export default async function FrontendLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isEnabled: isDraftMode } = await draftMode();
    return (
        <DraftModeProvider isDraftMode={isDraftMode}>
            {children}
            <Toaster />
            <PageTransitionHandler />
            {isDraftMode && (
                <>
                    <DisableDraftMode />
                    <VisualEditing />
                </>
            )}
            <SanityLive />
        </DraftModeProvider>
    );
}
