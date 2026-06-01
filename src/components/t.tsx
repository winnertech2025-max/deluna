"use client";

import { useLanguage } from "@/components/language-provider";
import type { DictionaryKey } from "@/lib/i18n";

export function T({ k }: { k: DictionaryKey }) {
  const { t } = useLanguage();
  return <>{t(k)}</>;
}
