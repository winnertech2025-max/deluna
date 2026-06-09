"use client";

import Image from "next/image";
import { FiArrowRight, FiEdit3, FiGift, FiHeart, FiShield, FiStar, FiTruck } from "react-icons/fi";
import { LinkButton } from "@/components/button";
import { useLanguage } from "@/components/language-provider";
import { ProductCard } from "@/components/product-card";
import { categoryMenu } from "@/lib/category-menu";
import { products } from "@/lib/products";
import type { Product } from "@/types";

const categoryImages = [
  "https://img.kwcdn.com/product/fancy/492fe046-85ec-438f-915b-fa085d70c13e.jpg",
  "https://img.kwcdn.com/product/fancy/611a2306-7f77-4c8a-a286-4396d3c5513a.jpg",
  "https://img.kwcdn.com/product/fancy/c9ccce5b-0f1b-4b37-89d7-67af8ec4b987.jpg",
  "https://img.kwcdn.com/product/fancy/ae505b70-a362-4eac-932c-31b576ce21f0.jpg",
  "https://img.kwcdn.com/product/fancy/debd2e53-18d8-429d-9f1a-953c731b99d6.jpg",
  "https://img.kwcdn.com/product/fancy/6d9821d9-9d30-4bf0-b96d-a70fa89d9f7d.jpg"
];

export default function HomePage() {
  const { t } = useLanguage();
  const bestSellers = products.filter((product) => product.isBestSeller).slice(0, 5);
  const studioPicks = products.slice(0, 4);

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-[#fff8ef]">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#fffaf4_0%,#fff_43%,#ffe5c4_100%)]" />
        <div className="relative mx-auto grid max-w-[1480px] items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:min-h-[690px] lg:grid-cols-[0.94fr_1.06fr] xl:px-8">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cocoa shadow-sm">
              <FiStar className="text-orange-500" /> {t("homeEyebrow")}
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.98] text-ink sm:text-6xl xl:text-7xl">
              {t("homeHeroTitle")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-cocoa sm:text-xl">
              {t("homeHeroBody")}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/shop">{t("startCustomizing")} <FiArrowRight /></LinkButton>
              <LinkButton href="/shop?best=1" variant="secondary">{t("shopGifts")}</LinkButton>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-black/10 rounded-lg border border-black/10 bg-white/80 shadow-sm">
              {[
                ["29+", t("customProducts")],
                ["10-14", t("deliveryStep")],
                ["0 EUR", t("aiPreview")]
              ].map(([value, label]) => (
                <div key={value} className="p-4">
                  <p className="text-xl font-semibold text-ink">{value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-cocoa">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-xl border border-white/80 bg-white p-3 shadow-soft">
              <div className="relative aspect-[5/4] overflow-hidden rounded-lg bg-linen sm:aspect-[4/3] lg:aspect-[5/4]">
                <Image src={products[3].image} alt="Personalized Deluna product" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm">
                  Free personalization
                </div>
                <div className="absolute inset-x-5 bottom-5 rounded-lg bg-white/92 p-5 shadow-sm backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cocoa">Choose it. Personalize it.</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {[
                      t("chooseProductStep"),
                      t("addTextStep"),
                      t("previewStep")
                    ].map((step, index) => (
                      <div key={step} className="flex items-center gap-2 text-sm font-semibold text-ink">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-500 text-xs text-white">{index + 1}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-5 -left-5 hidden w-44 rounded-lg border border-black/10 bg-white p-4 shadow-soft lg:block">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cocoa">{t("previewBeforeOrder")}</p>
              <p className="mt-2 text-2xl font-semibold text-ink">Luna</p>
              <p className="mt-1 text-sm text-cocoa">Name preview</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-ink text-white">
        <div className="mx-auto grid max-w-[1480px] gap-4 px-4 py-4 text-sm font-semibold sm:grid-cols-4 sm:px-6 xl:px-8">
          <span className="flex items-center gap-2"><FiTruck /> Gratis verzending</span>
          <span className="flex items-center gap-2"><FiShield /> Safe payments</span>
          <span className="flex items-center gap-2"><FiGift /> Gift-ready items</span>
          <span className="flex items-center gap-2"><FiHeart /> Preview before production</span>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 xl:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-cocoa">{t("customProducts")}</p>
            <h2 className="mt-3 text-4xl font-semibold text-ink">{t("personalizeEveryCategory")}</h2>
          </div>
          <LinkButton href="/shop" variant="ghost">{t("viewAllCategories")} <FiArrowRight /></LinkButton>
        </div>
        <div className="-mx-4 mt-8 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 xl:-mx-8 xl:px-8 [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-4">
            {categoryMenu.map((category, index) => {
              const Icon = category.icon;
              return (
                <a key={category.slug} href={`/shop?category=${category.slug}`} className="group w-[235px] shrink-0 overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft sm:w-[260px]">
                  <div className="relative h-44 bg-linen">
                    <Image src={categoryImages[index]} alt={category.label} fill className="object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
                    <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-orange-600 shadow-sm">
                      <Icon />
                    </span>
                    <div className="absolute inset-x-4 bottom-4">
                      <p className="max-w-[190px] text-xl font-semibold leading-tight text-white">{category.label}</p>
                      <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white/80">
                        Explore <FiArrowRight />
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-linen py-16">
        <div className="mx-auto grid max-w-[1480px] gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] xl:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-cocoa">{t("howItWorks")}</p>
            <h2 className="mt-3 text-4xl font-semibold text-ink">{t("madeSimple")}</h2>
            <p className="mt-5 text-base leading-7 text-cocoa">
              {t("customStudioMessage")}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              [t("chooseProductStep"), t("chooseProductStepText"), FiGift],
              [t("addTextStep"), t("addTextStepText"), FiEdit3],
              [t("previewStep"), t("previewStepText"), FiStar],
              [t("deliveryStep"), t("deliveryStepText"), FiTruck]
            ].map(([title, text, Icon]) => (
              <div key={String(title)} className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
                <Icon className="text-2xl text-cocoa" />
                <h3 className="mt-5 text-lg font-semibold text-ink">{String(title)}</h3>
                <p className="mt-3 text-sm leading-6 text-cocoa">{String(text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-white">
        <div className="mx-auto grid max-w-[1480px] gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] xl:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-champagne">{t("customizationFirst")}</p>
            <h2 className="mt-3 text-4xl font-semibold">{t("notRegularWebshop")}</h2>
            <p className="mt-5 max-w-xl leading-7 text-white/75">
              {t("notRegularText")}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[t("nameEngraving"), t("fontSelection"), t("aiPreview")].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/8 p-5">
                <FiStar className="text-champagne" />
                <p className="mt-5 font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductBand title={t("studioPicks")} href="/shop" products={studioPicks} viewAll={t("viewAll")} />
      <ProductBand title={t("bestSellers")} href="/shop?best=1" products={bestSellers} viewAll={t("viewAll")} />
    </div>
  );
}

function ProductBand({ title, href, products, viewAll }: { title: string; href: string; products: Product[]; viewAll: string }) {
  return (
    <section className="border-t border-black/10 bg-white py-14">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 xl:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-semibold text-ink">{title}</h2>
          <LinkButton href={href} variant="ghost">{viewAll} <FiArrowRight /></LinkButton>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
