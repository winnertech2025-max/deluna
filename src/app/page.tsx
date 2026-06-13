"use client";

import Image from "next/image";
import {
  FiArrowRight,
  FiCheckCircle,
  FiEdit3,
  FiGift,
  FiHeadphones,
  FiImage,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTruck
} from "react-icons/fi";
import { LinkButton } from "@/components/button";
import { useLanguage } from "@/components/language-provider";
import { ProductCard } from "@/components/product-card";
import { categoryMenu } from "@/lib/category-menu";
import { products } from "@/lib/products";

const categoryImages = [
  "https://img.kwcdn.com/product/fancy/492fe046-85ec-438f-915b-fa085d70c13e.jpg",
  "https://img.kwcdn.com/product/fancy/611a2306-7f77-4c8a-a286-4396d3c5513a.jpg",
  "https://img.kwcdn.com/product/fancy/c9ccce5b-0f1b-4b37-89d7-67af8ec4b987.jpg",
  "https://img.kwcdn.com/product/fancy/ae505b70-a362-4eac-932c-31b576ce21f0.jpg",
  "https://img.kwcdn.com/product/fancy/debd2e53-18d8-429d-9f1a-953c731b99d6.jpg",
  "https://img.kwcdn.com/product/fancy/6d9821d9-9d30-4bf0-b96d-a70fa89d9f7d.jpg"
];

const copy = {
  nl: {
    heroBadge: "Personaliseer voor het WK 2026",
    heroTitle: ["Kies het", "Personaliseer het", "Maak het van jou"],
    heroBody: "Gepersonaliseerde cadeaus voor echte voetbalfans. Maak elk moment bijzonder.",
    shopNow: "Shop nu",
    collection: "Bekijk WK collectie",
    socialProof: "Meer dan 500+ tevreden klanten",
    perks: [
      ["Gratis personalisatie", FiEdit3],
      ["Veilig betalen met iDEAL", FiShield],
      ["Verzending door heel Europa", FiTruck],
      ["Klantenservice in Nederland", FiHeadphones]
    ],
    trust: [
      ["Gratis verzending", "Vanaf EUR 49", FiTruck],
      ["Veilig betalen", "iDEAL, PayPal en kaart", FiShield],
      ["Vooraf bekijken", "AI preview voor productie", FiImage],
      ["Gift-ready", "Persoonlijk en netjes afgewerkt", FiGift]
    ],
    categoriesEyebrow: "Curated collections",
    categoriesTitle: "Kies op gevoel, niet uit eindeloze lijsten.",
    categoriesBody: "Deluna groepeert gepersonaliseerde items rond momenten: iets om te dragen, iets om te geven, iets om te bewaren.",
    viewCategory: "Ontdek",
    previewEyebrow: "De Deluna manier",
    previewTitle: "Persoonlijk maken zonder gedoe.",
    previewBody: "Een rustige flow voor klanten die snel willen zien wat mogelijk is: product kiezen, naam toevoegen, preview controleren en bestellen.",
    previewPoints: ["Kies een stijl die bij het moment past", "Voeg naam, datum of initialen toe", "Controleer de details voor productie"],
    bestEyebrow: "Meest gekozen",
    bestTitle: "Populaire keuzes voor een persoonlijk cadeau.",
    occasionsEyebrow: "Gift guide",
    occasionsTitle: "Een item dat past bij de persoon voor wie je koopt.",
    occasions: ["Voor haar", "Voor hem", "Voor kinderen", "Voor huis", "Voor huisdieren", "Voor feestdagen"],
    worldCupEyebrow: "Oranje collectie",
    worldCupTitle: "Maak je WK-moment persoonlijk.",
    worldCupBody: "Van shirts met naam tot tassen, caps en kleine cadeaus: geef de oranje zomer een detail dat echt van jou is.",
    worldCupCta: "Shop oranje items",
    worldCupHighlights: ["Naam of rugnummer", "Voor fans en families", "Perfect als wedstrijddag cadeau"],
    stepsEyebrow: "Zo werkt het",
    stepsTitle: "Van idee naar persoonlijk item in vier duidelijke stappen.",
    steps: [
      ["Kies je product", "Begin met een item dat past bij jouw moment."],
      ["Voeg je naam toe", "Selecteer tekst, font, kleur en positie."],
      ["Bekijk de preview", "Controleer hoe het product eruit kan zien."],
      ["Plaats je bestelling", "Wij maken het speciaal en leveren aan huis."]
    ],
    reviewsEyebrow: "Vertrouwen",
    reviewsTitle: "Een boutique gevoel, met de duidelijkheid van een moderne webshop.",
    reviews: [
      ["Lisa uit Amsterdam", "De preview gaf meteen vertrouwen. Het cadeau voelde echt persoonlijk."],
      ["Noor uit Utrecht", "Heel makkelijk te bestellen, ook op mobiel. Mooi rustig design."],
      ["Sophie uit Rotterdam", "Perfect voor een last-minute cadeau dat toch doordacht voelt."]
    ],
    finalTitle: "Maak vandaag iets dat niemand anders heeft.",
    finalBody: "Begin met een collectie, voeg jouw detail toe en bestel met vertrouwen.",
    finalCta: "Begin met personaliseren"
  },
  en: {
    heroBadge: "Personalize for World Cup 2026",
    heroTitle: ["Choose it", "Personalize it", "Make it yours"],
    heroBody: "Personalized gifts for true football fans. Make every moment feel special.",
    shopNow: "Shop now",
    collection: "View World Cup collection",
    socialProof: "More than 500+ happy customers",
    perks: [
      ["Free personalization", FiEdit3],
      ["Secure iDEAL payments", FiShield],
      ["Shipping across Europe", FiTruck],
      ["Customer support in the Netherlands", FiHeadphones]
    ],
    trust: [
      ["Free shipping", "From EUR 49", FiTruck],
      ["Secure checkout", "iDEAL, PayPal and card", FiShield],
      ["Preview first", "AI preview before production", FiImage],
      ["Gift-ready", "Personal and neatly finished", FiGift]
    ],
    categoriesEyebrow: "Curated collections",
    categoriesTitle: "Shop by feeling, not endless lists.",
    categoriesBody: "Deluna groups personalized items around moments: something to wear, something to gift, something to keep.",
    viewCategory: "Explore",
    previewEyebrow: "The Deluna way",
    previewTitle: "Personalization without friction.",
    previewBody: "A calm flow for customers who want to see what is possible fast: choose a product, add a name, check the preview and order.",
    previewPoints: ["Choose a style that fits the moment", "Add a name, date or initials", "Review the details before production"],
    bestEyebrow: "Most loved",
    bestTitle: "Popular choices for a personal gift.",
    occasionsEyebrow: "Gift guide",
    occasionsTitle: "An item that fits the person you are buying for.",
    occasions: ["For her", "For him", "For kids", "For home", "For pets", "For holidays"],
    worldCupEyebrow: "Orange collection",
    worldCupTitle: "Make your World Cup moment personal.",
    worldCupBody: "From name shirts to bags, caps and small gifts: give the orange summer a detail that feels truly yours.",
    worldCupCta: "Shop orange items",
    worldCupHighlights: ["Name or jersey number", "For fans and families", "Perfect as a match-day gift"],
    stepsEyebrow: "How it works",
    stepsTitle: "From idea to personal item in four clear steps.",
    steps: [
      ["Choose your product", "Start with an item that fits the occasion."],
      ["Add your name", "Select text, font, color and placement."],
      ["Preview the result", "Check how the product can look."],
      ["Place your order", "We make it special and deliver it home."]
    ],
    reviewsEyebrow: "Trust",
    reviewsTitle: "A boutique feeling with the clarity of a modern webshop.",
    reviews: [
      ["Lisa from Amsterdam", "The preview gave me confidence right away. The gift felt truly personal."],
      ["Noor from Utrecht", "Very easy to order, even on mobile. Beautiful and calm design."],
      ["Sophie from Rotterdam", "Perfect for a last-minute gift that still feels thoughtful."]
    ],
    finalTitle: "Make something no one else has.",
    finalBody: "Start with a collection, add your detail and order with confidence.",
    finalCta: "Start personalizing"
  }
};

export default function HomePage() {
  const { locale } = useLanguage();
  const c = copy[locale];
  const bestSellers = products.filter((product) => product.isBestSeller).slice(0, 4);
  const heroTitleClass =
    locale === "nl"
      ? "max-w-[640px] font-serif text-[2.28rem] font-bold leading-[1.08] tracking-normal text-[#211811] sm:text-[2.7rem] lg:text-[2.55rem] xl:text-[3rem] 2xl:text-[3.35rem]"
      : "max-w-[610px] font-serif text-[2.35rem] font-bold leading-[1.08] tracking-normal text-[#211811] sm:text-[2.9rem] lg:text-[2.8rem] xl:text-[3.25rem] 2xl:text-[3.55rem]";

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-[#fff8f0]">
        <div className="grid min-h-[650px] lg:grid-cols-[43%_57%]">
          <div className="relative z-10 flex flex-col justify-center overflow-hidden bg-[#fff8f0] px-5 py-14 sm:px-9 lg:pl-20 lg:pr-12 xl:pl-28 xl:pr-14 2xl:pl-36 2xl:pr-16">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-orange-100 bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-cocoa shadow-sm">
              <FiStar className="text-orange-500" />
              {c.heroBadge}
            </div>

            <h1 className={heroTitleClass}>
              {c.heroTitle.map((line) => (
                <span key={line} className="block text-[#211811]">
                  {line}
                  <span className="text-orange-500">.</span>
                </span>
              ))}
            </h1>

            <p className="mt-6 max-w-[510px] text-base leading-7 text-cocoa sm:text-lg">{c.heroBody}</p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {c.perks.map(([label, Icon]) => (
                <div key={label as string} className="rounded-lg border border-orange-100 bg-white/75 p-3 text-center shadow-sm">
                  <span className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-white text-orange-600 shadow-sm">
                    <Icon size={19} />
                  </span>
                  <p className="text-[11px] font-semibold leading-5 text-ink">{String(label)}</p>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/shop" className="min-h-14 rounded-[6px] bg-orange-600 px-8 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-orange-700">
                {c.shopNow} <FiArrowRight />
              </LinkButton>
              <LinkButton href="/shop?category=personalized-fashion" variant="secondary" className="min-h-14 rounded-[6px] border-orange-200 bg-white px-8 text-sm font-black uppercase tracking-[0.08em] text-ink hover:border-orange-400 hover:text-orange-700">
                {c.collection} <FiArrowRight />
              </LinkButton>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex -space-x-2">
                {[31, 44, 47, 56].map((avatar) => (
                  <span
                    key={avatar}
                    className="h-8 w-8 rounded-full border-2 border-white bg-orange-100 bg-cover"
                    style={{ backgroundImage: `url(https://i.pravatar.cc/64?img=${avatar})` }}
                  />
                ))}
              </div>
              <div className="flex text-orange-400">
                {[0, 1, 2, 3, 4].map((item) => (
                  <FiStar key={item} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm font-medium text-cocoa">{c.socialProof}</p>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden lg:min-h-[650px]">
            <div className="absolute inset-y-0 -left-28 right-0">
              <Image src="/images/bannerhero.png" alt="Deluna personalized gifts" fill priority className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#fff8f0] via-transparent to-transparent lg:hidden" />
            </div>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-px hidden h-full w-[300px] lg:block"
              preserveAspectRatio="none"
              viewBox="0 0 300 650"
            >
              <path
                d="M0 0H124C58 96 88 183 116 266C151 371 95 456 44 538C20 577 8 613 0 650V0Z"
                fill="#fff8f0"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="bg-[#15110e]">
        <div className="mx-auto grid max-w-[1536px] grid-cols-2 divide-x divide-white/10 px-4 sm:grid-cols-4 sm:px-8">
          {c.trust.map(([title, subtitle, Icon]) => (
            <div key={title as string} className="flex items-center gap-3 px-2 py-5 text-white sm:px-6">
              <Icon className="shrink-0 text-orange-400" size={22} />
              <div>
                <p className="text-sm font-bold">{String(title)}</p>
                <p className="text-xs text-white/55">{String(subtitle)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 xl:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <a href="/shop?category=personalized-fashion" className="group relative min-h-[430px] overflow-hidden rounded-lg bg-[#211811] shadow-sm">
              <Image src="/images/bannerhero.png" alt="World Cup personalized collection" fill className="object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-200">{c.categoriesEyebrow}</p>
                <h2 className="mt-3 max-w-lg text-3xl font-black leading-tight sm:text-4xl">{c.categoriesTitle}</h2>
                <p className="mt-4 max-w-xl leading-7 text-white/80">{c.categoriesBody}</p>
                <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-black uppercase tracking-[0.08em] transition group-hover:bg-orange-500">
                  {c.viewCategory} <FiArrowRight />
                </span>
              </div>
            </a>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {categoryMenu.map((category, index) => {
                const Icon = category.icon;
                return (
                  <a key={category.slug} href={`/shop?category=${category.slug}`} className="group rounded-lg border border-orange-100 bg-[#fff8f0] p-4 transition hover:-translate-y-1 hover:border-orange-300 hover:bg-white hover:shadow-xl">
                    <div className="relative aspect-square overflow-hidden rounded-md bg-white">
                      <Image src={categoryImages[index]} alt={category.label} fill className="object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div>
                        <span className="mb-3 grid h-9 w-9 place-items-center rounded-full bg-white text-orange-600 shadow-sm">
                          <Icon size={17} />
                        </span>
                        <h3 className="text-base font-black leading-tight text-[#211811]">{category.label}</h3>
                      </div>
                      <FiArrowRight className="mt-1 shrink-0 text-cocoa transition group-hover:translate-x-1 group-hover:text-orange-600" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-orange-100 bg-[#fff8f0] py-16">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 xl:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-600">{c.previewEyebrow}</p>
              <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight text-[#211811] sm:text-4xl">{c.previewTitle}</h2>
              <p className="mt-4 max-w-xl leading-7 text-cocoa">{c.previewBody}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {c.steps.slice(0, 3).map(([title, body], index) => (
                <div key={title} className="rounded-lg border border-orange-100 bg-white p-6 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">0{index + 1}</p>
                  <h3 className="mt-5 text-xl font-black text-[#211811]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-cocoa">{body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {c.previewPoints.map((point) => (
              <p key={point} className="flex items-center gap-3 rounded-full bg-white px-4 py-3 text-sm font-bold text-[#211811] shadow-sm">
                <FiCheckCircle className="shrink-0 text-orange-500" /> {point}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 xl:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-600">{c.bestEyebrow}</p>
              <h2 className="mt-3 text-3xl font-black text-[#211811] sm:text-4xl">{c.bestTitle}</h2>
            </div>
            <a href="/shop?best=1" className="hidden items-center gap-2 text-sm font-black text-orange-600 sm:flex">
              Shop <FiArrowRight />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff8f0] py-16 sm:py-20">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 xl:px-8">
          <div className="grid overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[360px]">
              <Image src="/images/bannerhero.png" alt="Orange World Cup personalized gifts" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-200">{c.worldCupEyebrow}</p>
                <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight sm:text-4xl">{c.worldCupTitle}</h2>
              </div>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="max-w-2xl text-lg leading-8 text-cocoa">{c.worldCupBody}</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {c.worldCupHighlights.map((item) => (
                  <div key={item} className="rounded-lg border border-orange-100 bg-[#fff8f0] p-4 text-sm font-bold text-ink">
                    <FiCheckCircle className="mb-3 text-orange-500" />
                    {item}
                  </div>
                ))}
              </div>
              <LinkButton href="/shop?category=personalized-fashion" className="mt-8 w-fit bg-orange-600 text-white hover:bg-orange-700">
                {c.worldCupCta} <FiArrowRight />
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-orange-100 bg-[#fff8f0] py-16">
        <div className="mx-auto grid max-w-[1480px] gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center xl:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-600">{c.reviewsEyebrow}</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight text-[#211811] sm:text-4xl">{c.reviewsTitle}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {c.reviews.map(([name, text], index) => (
              <div key={name} className="rounded-lg border border-orange-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex text-orange-400">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <FiStar key={star} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm leading-6 text-[#211811]">"{text}"</p>
                <div className="mt-5 flex items-center gap-3 border-t border-black/5 pt-4">
                  <span
                    className="h-9 w-9 rounded-full bg-orange-100 bg-cover"
                    style={{ backgroundImage: `url(https://i.pravatar.cc/64?img=${index + 22})` }}
                  />
                  <p className="text-sm font-bold text-cocoa">{name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-600 py-14">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between xl:px-8">
          <div>
            <h2 className="text-3xl font-black text-white sm:text-4xl">{c.finalTitle}</h2>
            <p className="mt-2 max-w-2xl text-orange-50">{c.finalBody}</p>
          </div>
          <LinkButton href="/shop" className="min-h-14 rounded-[6px] bg-white px-8 text-sm font-black uppercase tracking-[0.08em] text-orange-600 hover:bg-orange-50">
            {c.finalCta} <FiShoppingBag />
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
