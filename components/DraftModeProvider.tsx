"use client";

import { createContext, useContext, ReactNode } from "react";

const DraftModeContext = createContext(false);

export function DraftModeProvider({
    isDraftMode,
    children,
}: {
    isDraftMode: boolean;
    children: ReactNode;
}) {
    return (
        <DraftModeContext.Provider value={isDraftMode}>
            {children}
        </DraftModeContext.Provider>
    );
}

export function useIsDraftMode() {
    return useContext(DraftModeContext);
}
