"use client";

import { createContext, useContext } from "react";

type Dict = Record<string, unknown>;

const I18nContext = createContext<{ lang: LocalePage; dict: Dict } | null>(
  null,
);

export function I18nProvider({
  lang,
  dict,
  children,
}: {
  lang: LocalePage;
  dict: Dict;
  children: React.ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ lang, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
