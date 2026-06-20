"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiEdit3,
  FiGift,
  FiHeadphones,
  FiImage,
  FiShield,
  FiStar,
  FiTruck
} from "react-icons/fi";
import { LinkButton } from "@/components/button";
import { useLanguage } from "@/components/language-provider";
import { ProductCard } from "@/components/product-card";
import { categoryMenu } from "@/lib/category-menu";
import { products } from "@/lib/products";

const categoryImages = [
  "https://img.kwcdn.com/product/fancy/ae505b70-a362-4eac-932c-31b576ce21f0.jpg",
  "https://img.kwcdn.com/product/fancy/611a2306-7f77-4c8a-a286-4396d3c5513a.jpg",
  "https://img.kwcdn.com/product/fancy/6d9821d9-9d30-4bf0-b96d-a70fa89d9f7d.jpg",
  "https://img.kwcdn.com/product/fancy/bf195fa8-a957-4412-b590-5619fe5352b9.jpg",
  "https://img.kwcdn.com/product/fancy/492fe046-85ec-438f-915b-fa085d70c13e.jpg",
  "https://img.kwcdn.com/product/fancy/debd2e53-18d8-429d-9f1a-953c731b99d6.jpg",
  "https://img.kwcdn.com/product/fancy/c9ccce5b-0f1b-4b37-89d7-67af8ec4b987.jpg",
  "https://img.kwcdn.com/product/fancy/45399aff-9fb5-46fc-a16c-581df9e9270c.jpg"
];

const heroSlides = [
  "/images/bannerhero.png",
  "/images/herobanner2.png",
  "/images/herobanner3.png"

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
    categoryLabels: ["Tote bags", "T-shirts", "Mokken", "Caps", "Waterflessen", "Sieraden", "Accessoires", "Nieuw"],
    categorySlugs: ["bags", "clothing", "gifts", "hats", "accessories", "jewelry", "accessories", "gifts"],
    promos: [
      ["Voor oranje fans", "Draag je trots. Personaliseer je passie.", "Shop nu"],
      ["Voor elk moment", "Cadeaus die persoonlijk voelen. Elke keer opnieuw.", "Ontdek gifts"],
      ["Voor wie je liefhebt", "Van kleine verrassing naar grote herinnering.", "Voor familie"]
    ],
    productsEyebrow: "Trending right now",
    productsTitle: "Onze meest geliefde gepersonaliseerde gifts",
    viewAll: "Bekijk alle producten",
    whyEyebrow: "Waarom Deluna?",
    whyTitle: "Meer dan een gift. Het is hun verhaal.",
    whyItems: [
      ["Gepersonaliseerd", "Precies zoals jij het wilt", FiEdit3],
      ["Premium kwaliteit", "Gemaakt om cadeau te geven", FiGift],
      ["Snelle levering", "Door NL en Europa", FiTruck],
      ["Veilig betalen", "iDEAL, PayPal en kaart", FiShield],
      ["Gratis AI preview", "Bekijk voor productie", FiImage]
    ],
    reviewsEyebrow: "Geliefd door klanten",
    reviewsTitle: "Echte mensen. Echte verhalen.",
    reviews: [
      ["Lisa, Amsterdam", "De AI preview maakte het cadeau direct tastbaar. Super persoonlijk."],
      ["Mark, Rotterdam", "Snel besteld, mooi verpakt en precies zoals verwacht."],
      ["Sanne, Utrecht", "De naam en kleur klopten helemaal. Zeker een aanrader."]
    ],
    inspireEyebrow: "Get inspired",
    inspireTitle: "Zo personaliseert onze community het leven",
    instagram: "Bekijk op Instagram",
    newsletterTitle: "Plaats uw eerste bestelling",
    newsletterBody: "Meld je aan voor sweet deals en gift ideas.",
    newsletterPlaceholder: "Vul je e-mail in",
    newsletterButton: "Aanmelden"
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
    categoryLabels: ["Tote bags", "T-shirts", "Mugs", "Caps", "Water bottles", "Jewelry", "Accessories", "New in"],
    categorySlugs: ["bags", "clothing", "gifts", "hats", "accessories", "jewelry", "accessories", "gifts"],
    promos: [
      ["For orange fans", "Wear your pride. Personalize your passion.", "Shop now"],
      ["For every occasion", "Gifts that feel personal. Every single time.", "Explore gifts"],
      ["For the ones you love", "From small surprise to big memories.", "For family"]
    ],
    productsEyebrow: "Trending right now",
    productsTitle: "Our most loved personalised gifts",
    viewAll: "View all products",
    whyEyebrow: "Why Deluna?",
    whyTitle: "More than a gift. It is their story.",
    whyItems: [
      ["Personalised", "Just the way you want it", FiEdit3],
      ["Premium quality", "Made to last, made to love", FiGift],
      ["Fast delivery", "Shipped across NL and EU", FiTruck],
      ["Safe checkout", "iDEAL, PayPal and card", FiShield],
      ["Free AI preview", "See it before production", FiImage]
    ],
    reviewsEyebrow: "Loved by customers",
    reviewsTitle: "Real people. Real stories.",
    reviews: [
      ["Lisa, Amsterdam", "The AI preview made the gift feel real immediately. So personal."],
      ["Mark, Rotterdam", "Easy to order, beautifully packed and exactly as expected."],
      ["Sanne, Utrecht", "The name and color were perfect. Definitely recommended."]
    ],
    inspireEyebrow: "Get inspired",
    inspireTitle: "See how our community personalises life",
    instagram: "View on Instagram",
    newsletterTitle: "Start your first order",
    newsletterBody: "Sign up for sweet deals and gift ideas.",
    newsletterPlaceholder: "Enter your email",
    newsletterButton: "Sign me up"
  }
};

export default function HomePage() {
  const { locale } = useLanguage();
  const c = copy[locale];
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const bestSellers = products.filter((product) => product.isBestSeller).slice(0, 6);
  const galleryProducts = products.slice(6, 13);
  const heroTitleClass =
    locale === "nl"
      ? "max-w-[650px] font-serif text-[2.55rem] font-bold leading-[1.02] tracking-normal text-[#211811] sm:text-[3.25rem] lg:text-[3.25rem] xl:text-[3.0rem]"
      : "max-w-[620px] font-serif text-[2.65rem] font-bold leading-[1.02] tracking-normal text-[#211811] sm:text-[3.35rem] lg:text-[3.35rem] xl:text-[3.0rem]";
  const previewSteps =
    locale === "nl"
      ? [
          ["Typ de naam", "Kies tekst, font, kleur en plaatsing."],
          ["Bekijk de preview", "Laat AI een eerste visuele indruk maken."],
          ["Bestel met vertrouwen", "Wij bewaren de gekozen personalisatie bij je order."]
        ]
      : [
          ["Type the name", "Choose text, font, color and placement."],
          ["See the preview", "Let AI create a first visual impression."],
          ["Order with confidence", "We save the chosen personalization with your order."]
        ];
  const campaignProducts =
    locale === "nl"
      ? ["Naamshirt", "Oranje cap", "Team tote", "Fan mok"]
      : ["Name shirt", "Orange cap", "Team tote", "Fan mug"];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="bg-white text-[#211811]">
      {/* HERO SECTION - UNCHANGED */}
      <section className="relative overflow-hidden bg-[#fff8f0]">
        <div className="grid lg:min-h-[650px] lg:grid-cols-[43%_57%]">
          <div className="relative z-10 flex flex-col justify-center overflow-hidden bg-[#fff8f0] px-5 py-14 sm:px-9 lg:pl-20 lg:pr-12 xl:pl-28 xl:pr-14 2xl:pl-36 2xl:pr-16">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-orange-100 bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-cocoa shadow-sm">
              <FiStar className="text-orange-500" />
              {c.heroBadge}
            </div>

            <h1 className={heroTitleClass}>
              {c.heroTitle.map((line) => (
                <span key={line} className="block">
                  {line}
                  <span className="text-orange-500">.</span>
                </span>
              ))}
            </h1>

            <p className="mt-5 max-w-[510px] text-sm leading-7 text-cocoa sm:mt-6 sm:text-base">{c.heroBody}</p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {c.perks.map(([label, Icon]) => (
                <div key={label as string} className="group rounded-2xl border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/50 p-4 sm:p-5 text-center shadow-md hover:shadow-lg hover:border-orange-300 hover:-translate-y-1 transition-all duration-300">
                  <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 shadow-md group-hover:scale-110 transition-transform duration-300 ring-1 ring-orange-200">
                    <Icon size={22} />
                  </span>
                  <p className="text-[10px] sm:text-xs font-bold leading-5 text-[#211811] group-hover:text-orange-700 transition-colors">{String(label)}</p>
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

          <div className="relative min-h-[340px] overflow-hidden sm:min-h-[440px] lg:min-h-[650px]">
            <div className="absolute inset-y-0 -left-28 right-0">
              {heroSlides.map((slide, index) => (
                <Image
                  key={slide}
                  src={slide}
                  alt="Deluna personalized gifts"
                  fill
                  priority={index === 0}
                  className={`object-cover object-center transition-opacity duration-1000 ${
                    activeHeroSlide === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
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

      {/* CATEGORIES SECTION - REFINED */}
      <section className="relative z-0 overflow-hidden bg-white px-4 pb-10 pt-8 sm:px-6">
        <div className="mx-auto w-full max-w-[1420px] overflow-hidden">
          <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-8 sm:gap-3">
            {c.categoryLabels.map((label, index) => {
              const Icon = categoryMenu[index % categoryMenu.length].icon;
              const bgImage = categoryImages[index];
              return (
                <a
                  key={`${label}-${index}`}
                  href={`/shop?category=${c.categorySlugs[index]}`}
                  className="group relative min-w-0 overflow-hidden rounded-2xl min-h-[110px] sm:min-h-[130px] shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <Image
                    src={bgImage}
                    alt={label}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-300" />
                  <div className="relative h-full flex flex-col items-center justify-center gap-2 sm:gap-3 p-3">
                    <div className="p-2 rounded-full bg-white/95 ring-1 ring-white/50 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-orange-600" size={22} />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-white drop-shadow-md text-center leading-3 group-hover:text-orange-300 transition-colors duration-300">{label}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROMOS SECTION - REDESIGNED */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto grid max-w-[1420px] gap-6 px-4 sm:px-6 lg:grid-cols-3">
          {c.promos.map(([eyebrow, title, cta], index) => (
            <a 
              key={title} 
              href="/shop" 
              className="group relative min-h-[380px] overflow-hidden rounded-3xl shadow-lg ring-1 ring-orange-100 transition-all duration-500 hover:shadow-2xl hover:ring-orange-200"
            >
              <Image 
                src={index === 0 ? "/images/bannerhero.png" : categoryImages[index + 2]} 
                alt={title} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/0 group-hover:from-black/70 transition-all duration-500" />
              <div className="relative flex h-full flex-col justify-between p-8">
                <div className="mt-auto">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">{eyebrow}</p>
                  <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold leading-tight text-white drop-shadow-lg">{title}</h2>
                </div>
                <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border-2 border-white/60 bg-white/15 backdrop-blur-md px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-white transition-all duration-300 group-hover:bg-white/25 group-hover:border-white">
                  {cta} <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* PRODUCTS SECTION - REDESIGNED */}
      <section className="bg-gradient-to-b from-white via-orange-50/20 to-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1420px] px-4 sm:px-6">
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">{c.productsEyebrow}</p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-[#211811]">{c.productsTitle}</h2>
            <div className="mt-6 h-1.5 w-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-6">
            {bestSellers.map((product) => (
              <div key={product.id} className="transition-all duration-300 hover:scale-105">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <a href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white text-sm font-black uppercase tracking-[0.08em] rounded-lg hover:bg-orange-700 hover:shadow-lg transition-all duration-300 group">
              {c.viewAll} <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* WORLD CUP CAMPAIGN BOARD */}
      <section className="bg-[#ffffff] px-4 py-14 sm:px-6 sm:py-20">
        <div className="relative mx-auto max-w-[1420px] overflow-hidden rounded-[34px] bg-[#12100d] shadow-2xl ring-1 ring-orange-400/25">
          <Image src="/images/footballbackground.jpg" alt="Football stadium" fill className="object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/70 to-black/55" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_34%,rgba(255,115,0,0.42),transparent_34%),radial-gradient(circle_at_12%_88%,rgba(255,93,0,0.28),transparent_30%)]" />

          <div className="relative grid gap-8 p-5 sm:p-8 lg:min-h-[650px] lg:grid-cols-[0.85fr_1.2fr_0.5fr] lg:p-10">
            <div className="relative hidden min-h-[560px] overflow-hidden rounded-[28px] border border-white/10 bg-white/5 lg:block">
              <div className="absolute left-5 top-5 z-10 rounded-full border border-orange-300/40 bg-black/40 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-orange-200 backdrop-blur">
                Virgil van Dijk
              </div>
              <Image src="/images/player.png" alt="Virgil van Dijk" fill className="object-cover object-top opacity-100 mix-blend-lighten" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/45 to-transparent p-6">
                <p className="text-[5rem] font-black uppercase leading-none tracking-[-0.08em] text-white/10">VVD</p>
                <p className="-mt-4 text-sm font-black uppercase tracking-[0.18em] text-orange-300">
                  {locale === "nl" ? "Oranje inspiratie" : "Orange inspiration"}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between lg:min-h-[560px]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/40 bg-orange-500/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-100 backdrop-blur">
                  <FiStar className="text-orange-300" />
                  {locale === "nl" ? "World Cup custom drop" : "World Cup custom drop"}
                </div>
                <h2 className="mt-6 max-w-3xl font-serif text-4xl font-bold leading-[0.98] text-white sm:text-5xl xl:text-6xl">
                  {locale === "nl" ? "Shop samen voor het WK." : "Shop together for the World Cup."}
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/75">
                  {locale === "nl"
                    ? "Maak wedstrijddagen persoonlijk met custom shirts, fan bags, caps, banners en kleine Oranje gifts voor familie en vrienden."
                    : "Make match days personal with custom shirts, fan bags, caps, banners and small Orange gifts for family and friends."}
                </p>
              </div>

              <div className="relative mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                <div className="rounded-[28px] border border-white/10 bg-black/35 p-5 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-300">
                    {locale === "nl" ? "Maak jouw kit" : "Build your kit"}
                  </p>
                
                  <a href="/shop?category=clothing" className="mt-5 inline-flex w-full items-center justify-center gap-1 rounded-2xl bg-orange-600  py-4 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-orange-500">
                    {locale === "nl" ? "Shop WK collectie" : "Shop World Cup edit"} <FiArrowRight />
                  </a>
                </div>

                <div className="relative min-h-[260px] sm:min-h-[340px]">
                  <div className="absolute inset-x-6 bottom-2 top-10 rounded-full bg-orange-500/25 blur-3xl" />
                  <Image src="/images/shirtfootball.png" alt="Custom orange football shirt" fill className="object-contain drop-shadow-2xl" />
                </div>
              </div>
            </div>

            <div className="grid content-between gap-3 sm:grid-cols-4 lg:grid-cols-1">
              {[
                [locale === "nl" ? "Custom shirts" : "Custom shirts", categoryImages[1]],
                [locale === "nl" ? "Fan caps" : "Fan caps", categoryImages[3]],
                [locale === "nl" ? "Banners" : "Banners", categoryImages[6]],
                [locale === "nl" ? "Gift bags" : "Gift bags", categoryImages[0]]
              ].map(([title, image]) => (
                <a key={title} href="/shop?category=clothing" className="group overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-2 backdrop-blur transition hover:bg-white/15">
                  <div className="relative h-28 overflow-hidden rounded-xl">
                    <Image src={image} alt={title} fill className="object-cover transition duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <p className="absolute bottom-3 left-3 text-xs font-black uppercase tracking-[0.12em] text-white">{title}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="relative border-t border-white/10 bg-black/35 px-5 py-4 sm:px-8">
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                locale === "nl" ? "Gratis AI preview voor productie" : "Free AI preview before production",
                locale === "nl" ? "Naam en nummer personalisatie" : "Name and number personalization",
                locale === "nl" ? "Fan items voor familie en teams" : "Fan items for families and teams",
                locale === "nl" ? "Verzending door NL en EU" : "Shipping across NL and EU"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-3 text-xs font-bold text-white/85">
                  <FiCheckCircle className="shrink-0 text-orange-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION - REDESIGNED */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1420px] px-4 sm:px-6">
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">{c.reviewsEyebrow}</p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-[#211811]">{c.reviewsTitle}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_0.85fr]">
            {c.reviews.map(([name, text], index) => (
              <div key={name} className="group rounded-2xl bg-gradient-to-br from-orange-50 to-white p-6 shadow-md hover:shadow-xl ring-1 ring-orange-100 group-hover:ring-orange-300 transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4 flex gap-1">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <FiStar key={star} fill="currentColor" className="text-orange-500" size={16} />
                  ))}
                </div>
                <p className="text-sm leading-7 text-[#211811] font-medium">"{text}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-orange-100 pt-4">
                  <span
                    className="h-10 w-10 rounded-full bg-orange-100 bg-cover ring-2 ring-orange-200"
                    style={{ backgroundImage: `url(https://i.pravatar.cc/64?img=${index + 22})` }}
                  />
                  <p className="text-xs font-black text-[#211811]">{name}</p>
                </div>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 p-6 text-center ring-2 ring-orange-300 shadow-md">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-700">Excellent</p>
              <div className="mt-4 flex gap-1">
                {[0, 1, 2, 3, 4].map((star) => (
                  <FiStar key={star} fill="currentColor" className="text-orange-500" size={18} />
                ))}
              </div>
              <p className="mt-4 text-4xl font-black text-orange-700">4.9</p>
              <p className="mt-1 text-xs text-orange-600">/5 stars</p>
              <p className="mt-3 text-xs text-orange-600 font-semibold">2,430 reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION - REDESIGNED */}
      <section className="bg-gradient-to-b from-white to-orange-50/30 py-16 sm:py-20">
        <div className="mx-auto max-w-[1420px] px-4 sm:px-6">
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">{c.inspireEyebrow}</p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-[#211811]">{c.inspireTitle}</h2>
            <div className="mt-6 h-1.5 w-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto" />
          </div>
          <div className="flex items-center justify-center mb-8">
            <a href="/shop" className="hidden rounded-lg border border-orange-300 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-orange-700 hover:border-orange-500 hover:bg-orange-50 sm:inline-flex group">
              {c.instagram} <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 min-[420px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7">
            {galleryProducts.map((product) => (
              <a 
                key={product.id} 
                href={`/product/${product.slug}`} 
                className="group relative aspect-square overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-orange-100 transition-all duration-300 hover:shadow-xl hover:ring-orange-300"
              >
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-125" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* AI PREVIEW STUDIO */}
      {/* <section className="border-t border-orange-100 bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1420px] gap-8 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[34px] bg-[#211811] p-4 shadow-2xl">
            <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[420px] overflow-hidden rounded-[26px]">
                <Image src={categoryImages[5]} alt="AI preview example" fill className="object-cover" />
                <div className="absolute inset-x-8 bottom-10 rounded-full bg-white/90 px-8 py-4 text-center shadow-xl backdrop-blur">
                  <span className="font-serif text-4xl font-bold text-orange-600">Luna</span>
                </div>
              </div>
              <div className="rounded-[26px] bg-white p-7">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">AI preview</p>
                <h3 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#211811]">
                  {locale === "nl" ? "Laat klanten kijken voordat wij maken." : "Let customers see it before we make it."}
                </h3>
                <p className="mt-4 text-sm leading-7 text-cocoa">
                  {locale === "nl"
                    ? "De preview helpt klanten hun naam, kleur en gevoel te controleren voordat het product naar productie gaat."
                    : "The preview helps customers check the name, color and feeling before the product goes into production."}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">
              {locale === "nl" ? "Gratis preview studio" : "Free preview studio"}
            </p>
            <h2 className="mt-3 max-w-xl font-serif text-4xl font-bold leading-tight text-[#211811] sm:text-5xl">
              {locale === "nl" ? "Minder twijfel bij custom producten." : "Less doubt for custom products."}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-cocoa">
              {locale === "nl"
                ? "Personaliseren voelt spannend. Daarom maakt Deluna het aankoopmoment visueel, rustig en duidelijk."
                : "Personalization can feel uncertain. Deluna makes the buying moment visual, calm and clear."}
            </p>
            <div className="mt-8 space-y-3">
              {previewSteps.map(([title, body]) => (
                <div key={title} className="flex gap-4 rounded-2xl border border-orange-100 bg-[#fff8f0] p-5">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-orange-600 shadow-sm">
                    <FiCheckCircle />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-[#211811]">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-cocoa">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* ORANJE MATCHDAY EDIT */}
      <section className="relative overflow-hidden bg-[#18100b] py-16 text-white sm:py-20">
        <div className="absolute inset-0 opacity-40">
          <Image src="/images/bannerhero.png" alt="Oranje personalized products" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#18100b] via-[#18100b]/88 to-[#18100b]/45" />
        </div>
        <div className="relative mx-auto grid max-w-[1420px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">
              {locale === "nl" ? "Oranje edit" : "Orange edit"}
            </p>
            <h2 className="mt-3 max-w-xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
              {locale === "nl" ? "Gemaakt voor fans die hun naam willen dragen." : "Made for fans who want to wear their name."}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/75">
              {locale === "nl"
                ? "Een compacte WK-selectie met items voor wedstrijddagen, watch parties en kleine cadeaus."
                : "A compact World Cup selection for match days, watch parties and small gifts."}
            </p>
            <a href="/shop?category=clothing" className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-600 px-7 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-orange-500">
              {locale === "nl" ? "Shop oranje items" : "Shop orange items"} <FiArrowRight />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {campaignProducts.map((product, index) => (
              <a key={product} href="/shop?category=clothing" className="group rounded-[26px] border border-white/10 bg-white/10 p-3 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15">
                <div className="relative aspect-square overflow-hidden rounded-[20px] bg-orange-100">
                  <Image src={index % 2 === 0 ? categoryImages[1] : categoryImages[3]} alt={product} fill className="object-cover transition duration-500 group-hover:scale-110" />
                </div>
                <div className="flex items-center justify-between px-1 py-4">
                  <span className="text-sm font-black">{product}</span>
                  <FiArrowRight className="text-orange-300 transition group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION - WITH BACKGROUND IMAGE */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/images/herobanner2.png" 
            alt="Newsletter background" 
            fill 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/85 to-orange-500/75" />
        </div>
        
        <div className="mx-auto max-w-[1420px] px-4 sm:px-6 relative z-10">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-100">Newsletter</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">{c.newsletterTitle}</h2>
            <p className="mt-3 text-white/90 text-sm sm:text-base">{c.newsletterBody}</p>
            
            <form className="mt-6 flex flex-col sm:flex-row gap-3">
              <input 
                className="flex-1 px-4 sm:px-5 py-3 sm:py-4 rounded-lg border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 text-sm outline-none transition-all duration-300 focus:border-white focus:bg-white/20" 
                placeholder={c.newsletterPlaceholder} 
                type="email" 
              />
              <button 
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-orange-600 font-black uppercase tracking-[0.08em] rounded-lg hover:bg-orange-50 hover:shadow-xl transition-all duration-300 flex-shrink-0" 
                type="button"
              >
                {c.newsletterButton}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
