"use client";

import Image from "next/image";
import { FiArrowRight, FiCheckCircle, FiEdit3, FiGift, FiHeart, FiShield, FiStar, FiTruck } from "react-icons/fi";
import { LinkButton } from "@/components/button";
import { useLanguage } from "@/components/language-provider";
import { ProductCard } from "@/components/product-card";
import { categoryDescriptions, categoryImages, categoryLabels, products } from "@/lib/products";
import type { Category, Product } from "@/types";

const categoryKeys = Object.keys(categoryLabels) as Category[];

export default function HomePage() {
  const { t } = useLanguage();
  const bestSellers = products.filter((product) => product.isBestSeller).slice(0, 5);
  const studioPicks = products.slice(0, 4);

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-linen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(220,190,128,0.28),transparent_34%),linear-gradient(135deg,#fbf7f1_0%,#f3eadf_54%,#fff_100%)]" />
        <div className="relative mx-auto grid min-h-[780px] max-w-[1480px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] xl:px-8">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-cocoa shadow-sm">
              <FiStar className="text-champagne" /> {t("homeEyebrow")}
            </div>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] text-ink sm:text-7xl">
              {t("homeHeroTitle")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-cocoa">
              {t("homeHeroBody")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/shop">{t("startCustomizing")} <FiArrowRight /></LinkButton>
              <LinkButton href="/shop?best=1" variant="secondary">{t("shopGifts")}</LinkButton>
            </div>
            <div className="mt-8 flex max-w-xl flex-wrap gap-2">
              {categoryKeys.slice(0, 5).map((key) => (
                <a key={key} href={`/shop?category=${key}`} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:bg-champagne">
                  {categoryLabels[key]}
                </a>
              ))}
            </div>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {[t("pickProduct"), t("addName"), t("previewBeforeOrder")].map((item) => (
                <div key={item} className="rounded-lg border border-black/10 bg-white p-4 text-sm font-semibold text-ink shadow-sm">
                  <FiCheckCircle className="mb-3 text-cocoa" /> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[640px]">
            <div className="absolute left-0 top-8 z-10 w-[42%] overflow-hidden rounded-lg border border-black/10 bg-white p-3 shadow-soft">
              <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-linen">
                <Image src={products[1].image} alt="Personalized jewelry" fill className="object-cover" priority />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-ink">Nameplate Pendant Necklace</p>
                <p className="mt-1 text-sm text-cocoa">Preview: Luna</p>
              </div>
            </div>

            <div className="absolute right-0 top-0 w-[62%] overflow-hidden rounded-lg border border-black/10 bg-white p-3 shadow-soft">
              <div className="relative aspect-[5/4] overflow-hidden rounded-md bg-linen">
                <Image src={products[3].image} alt="Personalized bag" fill className="object-cover" />
                <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm">Free personalization</div>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-3 p-3">
                <div>
                  <p className="font-semibold text-ink">Personalized Tote Bag</p>
                  <p className="text-sm text-cocoa">Add name, color and placement</p>
                </div>
                <span className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">€14.80</span>
              </div>
            </div>

            <div className="absolute bottom-8 left-[18%] w-[44%] overflow-hidden rounded-lg border border-black/10 bg-white p-3 shadow-soft">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-linen">
                <Image src={products[6].image} alt="Custom clothing" fill className="object-cover" />
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 rounded-md border-2 border-dashed border-white bg-ink/70 px-4 py-3 text-center text-lg font-bold text-white">
                  YOUR TEXT
                </div>
              </div>
            </div>

            <div className="absolute bottom-14 right-4 z-20 w-[38%] rounded-lg border border-black/10 bg-white p-5 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cocoa">Ready to personalize</p>
              <div className="mt-4 space-y-3">
                {["Choose product", "Type your name", "Confirm preview"].map((text, index) => (
                  <div key={text} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-champagne text-xs font-bold text-ink">{index + 1}</span>
                    <span className="text-sm font-semibold text-ink">{text}</span>
                  </div>
                ))}
              </div>
              <a href="/shop" className="mt-5 flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-bold text-white">
                Start now <FiArrowRight />
              </a>
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

      <section className="mx-auto max-w-[1480px] px-4 py-16 sm:px-6 xl:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-cocoa">{t("customProducts")}</p>
            <h2 className="mt-3 text-4xl font-semibold text-ink">{t("personalizeEveryCategory")}</h2>
          </div>
          <LinkButton href="/shop" variant="ghost">{t("viewAllCategories")} <FiArrowRight /></LinkButton>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categoryKeys.map((key) => (
            <a key={key} href={`/shop?category=${key}`} className="group overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
              <div className="relative h-56 bg-linen">
                <Image src={categoryImages[key]} alt={categoryLabels[key]} fill className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-4 text-2xl font-semibold text-white">{categoryLabels[key]}</p>
              </div>
              <div className="p-5">
                <p className="text-sm leading-6 text-cocoa">{categoryDescriptions[key]}</p>
              </div>
            </a>
          ))}
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
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
