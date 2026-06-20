"use client";

import { ProductCard } from "@/components/product-card";
import { useLanguage } from "@/components/language-provider";
import type { Product } from "@/types";

const copy = {
  nl: {
    eyebrow: "Ook mooi",
    title: "Meer uit deze collectie",
    empty: "Er zijn nog geen vergelijkbare producten."
  },
  en: {
    eyebrow: "Also lovely",
    title: "More from this collection",
    empty: "No related products yet."
  }
} as const;

export function RelatedProducts({ products }: { products: Product[] }) {
  const { locale } = useLanguage();
  const text = copy[locale];

  if (!products.length) {
    return (
      <section className="mt-14 rounded-[28px] border border-orange-100 bg-[#fff8f0] p-8 text-center text-cocoa">
        {text.empty}
      </section>
    );
  }

  return (
    <section className="mt-16">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">{text.eyebrow}</p>
      <h2 className="mt-2 font-serif text-3xl font-black text-ink sm:text-4xl">{text.title}</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
