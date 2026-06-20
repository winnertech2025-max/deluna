"use client";

import Image from "next/image";
import { FiArrowRight, FiGift, FiHeart, FiPenTool, FiShield, FiStar, FiTruck } from "react-icons/fi";
import { LinkButton } from "@/components/button";
import { useLanguage } from "@/components/language-provider";

const copy = {
  nl: {
    eyebrow: "Over Deluna Studio",
    title: "Gemaakt om verhalen persoonlijk te maken.",
    subtitle: "Deluna Studio is geinspireerd door Luna en Devina, twee meisjes die gewone dingen graag veranderen in iets dat echt van henzelf is.",
    intro: [
      "Door hun creativiteit en unieke persoonlijkheden ontstond het idee achter Deluna Studio.",
      "Wij geloven dat iedereen de mogelijkheid verdient om iets persoonlijks te creeren: iets dat een verhaal vertelt, herinneringen bewaart en laat zien wie je bent.",
      "Daarom is Deluna Studio meer dan alleen een webshop voor gepersonaliseerde producten. Het is een plek waar ideeen veranderen in betekenisvolle herinneringen."
    ],
    missionTitle: "Onze missie",
    mission: "Mensen inspireren om producten te creeren, personaliseren en koesteren die echt bij hen passen.",
    promise: "Want de mooiste producten zijn niet altijd de duurste. Het zijn de producten die jouw verhaal vertellen.",
    cta: "Ontdek gepersonaliseerde cadeaus",
    contact: "Neem contact op",
    values: [
      ["Persoonlijk ontwerp", "Naam, tekst, initialen of kleur: elk detail voelt eigen."],
      ["AI preview", "Bekijk je ontwerp voordat het in productie gaat."],
      ["Gift-ready", "Gemaakt als cadeau dat direct betekenis heeft."],
      ["Veilig bestellen", "Duidelijke checkout, tracking en support."]
    ],
    timeline: [
      ["01", "Kies een item", "Selecteer sieraden, tassen, kleding of cadeaus."],
      ["02", "Maak het eigen", "Voeg naam, tekst, initialen, kleur of font toe."],
      ["03", "Wij maken het", "Je item wordt speciaal voor jou gepersonaliseerd."],
      ["04", "Ontvang je verhaal", "Thuisbezorgd als uniek item of cadeau."]
    ]
  },
  en: {
    eyebrow: "About Deluna Studio",
    title: "Made to turn stories into personal pieces.",
    subtitle: "Deluna Studio was inspired by Luna and Devina, two girls who love turning ordinary things into something uniquely their own.",
    intro: [
      "Watching them express their personalities through creativity inspired the idea behind Deluna Studio.",
      "We believe everyone deserves the opportunity to create something personal: something that reflects their story, style, memories and the people they love.",
      "That is why Deluna Studio is more than a personalized gift shop. It is a place where ideas become meaningful keepsakes."
    ],
    missionTitle: "Our mission",
    mission: "To inspire people to create, personalize and cherish products that truly belong to them.",
    promise: "Because the most meaningful things are the ones that tell your story.",
    cta: "Explore personalized gifts",
    contact: "Contact us",
    values: [
      ["Personal design", "Names, text, initials or color: every detail feels yours."],
      ["AI preview", "See your design before it goes into production."],
      ["Gift-ready", "Made as a gift with meaning from the first moment."],
      ["Secure order", "Clear checkout, tracking and customer support."]
    ],
    timeline: [
      ["01", "Choose an item", "Select jewelry, bags, clothing or gifts."],
      ["02", "Make it yours", "Add a name, text, initials, color or font."],
      ["03", "We make it", "Your item is personalized especially for you."],
      ["04", "Receive your story", "Delivered as a unique item or gift."]
    ]
  }
} as const;

const valueIcons = [FiPenTool, FiStar, FiGift, FiShield];

export default function AboutPage() {
  const { locale } = useLanguage();
  const text = copy[locale];

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-[#fff8f0]">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-orange-50 to-transparent" />
        <div className="relative mx-auto grid max-w-[1380px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-20 xl:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-600">{text.eyebrow}</p>
            <h1 className="mt-5 max-w-2xl font-serif text-4xl font-black leading-[1.02] text-ink sm:text-5xl lg:text-6xl">{text.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-cocoa">{text.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/shop" className="bg-orange-600 text-white hover:bg-orange-700">
                {text.cta} <FiArrowRight />
              </LinkButton>
              <LinkButton href="/contact" variant="secondary">{text.contact}</LinkButton>
            </div>
          </div>

          <div className="grid min-h-[420px] gap-4 sm:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[360px] overflow-hidden rounded-[32px] bg-ink shadow-2xl sm:translate-y-10">
              <Image src="/images/herobanner2.png" alt="Personalized gift" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <p className="absolute bottom-5 left-5 right-5 text-2xl font-black leading-tight text-white">{text.promise}</p>
            </div>
            <div className="grid gap-4">
              <div className="relative min-h-[240px] overflow-hidden rounded-[32px] bg-orange-100 shadow-soft">
                <Image src="/images/bannerhero.png" alt="Deluna Studio story" fill className="object-cover" />
              </div>
              <div className="rounded-[32px] border border-orange-100 bg-white p-6 shadow-soft">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">{text.missionTitle}</p>
                <p className="mt-3 text-xl font-black leading-8 text-ink">{text.mission}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-6 md:grid-cols-4">
          {text.values.map(([title, body], index) => {
            const Icon = valueIcons[index];
            return (
              <article key={title} className="rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600"><Icon size={22} /></span>
                <h2 className="mt-5 text-lg font-black text-ink">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-cocoa">{body}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-600">Deluna</p>
            <h2 className="mt-3 font-serif text-4xl font-black leading-tight text-ink">{text.missionTitle}</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-cocoa">
              {text.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {text.timeline.map(([number, title, body]) => (
              <article key={number} className="rounded-[28px] border border-orange-100 bg-[#fff8f0] p-6">
                <span className="text-xs font-black uppercase tracking-[0.24em] text-orange-600">{number}</span>
                <h3 className="mt-4 text-xl font-black text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-cocoa">{body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-6 rounded-[32px] bg-ink p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-300">Choose it. Personalize it. Make it yours.</p>
            <h2 className="mt-3 font-serif text-3xl font-black sm:text-4xl">{text.promise}</h2>
          </div>
          <LinkButton href="/shop" className="bg-orange-600 text-white hover:bg-orange-700">
            {text.cta} <FiTruck />
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
