"use client";

import Image from "next/image";
import { FiHeart, FiPenTool, FiStar } from "react-icons/fi";
import { useLanguage } from "@/components/language-provider";

const copy = {
  nl: {
    eyebrow: "Over Deluna Studio",
    title: "Your Style. Your Story.",
    intro: [
      "Deluna Studio is geinspireerd door twee bijzondere meisjes: Luna en Devina, de dochters van onze oprichter.",
      "Zoals veel kinderen zijn zij van nature nieuwsgierig, creatief en vol verbeeldingskracht. Ze houden ervan om te tekenen, kleuren te kiezen, ontwerpen te bedenken en gewone voorwerpen om te toveren tot iets dat echt van henzelf is.",
      "Door hun creativiteit en unieke persoonlijkheden ontstond het idee achter Deluna Studio."
    ],
    body: [
      "Wij geloven dat iedereen de mogelijkheid verdient om iets persoonlijks te creeren - iets dat een verhaal vertelt, herinneringen bewaart en laat zien wie je bent.",
      "Daarom is Deluna Studio meer dan alleen een webshop voor gepersonaliseerde producten. Het is een plek waar ideeen veranderen in betekenisvolle herinneringen en waar gewone producten worden omgetoverd tot unieke items die speciaal voor jou gemaakt zijn.",
      "Van sieraden en accessoires tot tassen, kleding en cadeaus: elk product is ontworpen om individualiteit, creativiteit en persoonlijke verhalen te vieren."
    ],
    mission: "Mensen inspireren om producten te creeren, personaliseren en koesteren die echt bij hen passen.",
    close: "Want de mooiste producten zijn niet altijd de duurste. Het zijn de producten die jouw verhaal vertellen."
  },
  en: {
    eyebrow: "About Deluna Studio",
    title: "Your Style. Your Story.",
    intro: [
      "Deluna Studio was inspired by two very special girls: Luna and Devina, the daughters of our founder.",
      "Like many children, they are naturally curious, imaginative, and full of creativity. They love drawing, designing, choosing colors, adding their names to things, and turning ordinary items into something uniquely their own.",
      "Watching them express their personalities through creativity inspired the idea behind Deluna Studio."
    ],
    body: [
      "We believe that everyone deserves the opportunity to create something personal - something that reflects their story, style, memories, and the people they love.",
      "That's why Deluna Studio is more than just a personalized gift shop. It is a place where ideas become meaningful keepsakes, and where ordinary products are transformed into one-of-a-kind pieces made just for you.",
      "From jewelry and accessories to bags, clothing, and gifts, every item is designed to celebrate individuality and creativity."
    ],
    mission: "To inspire people to create, personalize, and cherish products that truly belong to them.",
    close: "Because the most meaningful things are the ones that tell your story."
  }
} as const;

export default function AboutPage() {
  const { locale } = useLanguage();
  const text = copy[locale];

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-linen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,138,0,0.25),transparent_30%),linear-gradient(135deg,#fff7ed_0%,#fff_58%,#ffedd5_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:py-16">
          <div className="relative min-h-[360px] overflow-hidden rounded-lg bg-ink shadow-soft sm:min-h-[520px]">
            <Image src="/images/logo-deluna-studio.png" alt="Deluna Studio logo" fill className="object-cover opacity-90" priority />
            <div className="absolute inset-x-5 bottom-5 rounded-lg bg-white/92 p-4 text-ink backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cocoa">Deluna Studio</p>
              <p className="mt-2 text-2xl font-semibold">{text.title}</p>
            </div>
          </div>

          <div className="self-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cocoa">{text.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink sm:text-6xl">
              {text.title}
            </h1>
            <div className="mt-6 space-y-4 text-base leading-8 text-cocoa sm:text-lg">
              {[...text.intro, ...text.body].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="mt-8 rounded-lg border border-orange-200 bg-orange-50 p-5">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-orange-700"><FiStar /> Mission</p>
              <p className="mt-3 text-xl font-semibold leading-8 text-ink">{text.mission}</p>
              <p className="mt-3 leading-7 text-cocoa">{text.close}</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Creative", FiPenTool],
                ["Personal", FiHeart],
                ["Giftable", FiStar]
              ].map(([label, Icon]) => (
                <div key={String(label)} className="rounded-lg border border-black/10 bg-white p-4 font-semibold text-ink shadow-sm">
                  <Icon className="mb-3 text-champagne" /> {String(label)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
