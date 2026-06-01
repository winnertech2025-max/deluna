"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dictionaries, type DictionaryKey, type Locale } from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: DictionaryKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("nl");

  useEffect(() => {
    const saved = window.localStorage.getItem("deluna_locale") as Locale | null;
    if (saved === "nl" || saved === "en") setLocaleState(saved);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale(next) {
        setLocaleState(next);
        window.localStorage.setItem("deluna_locale", next);
      },
      t(key) {
        return dictionaries[locale][key];
      }
    }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
