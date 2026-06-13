"use client";

import Image from "next/image";
import { FiArrowRight, FiHeart, FiPenTool, FiStar } from "react-icons/fi";
import { LinkButton } from "@/components/button";
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
    close: "Want de mooiste producten zijn niet altijd de duurste. Het zijn de producten die jouw verhaal vertellen.",
    cta: "Ontdek de collectie"
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
    close: "Because the most meaningful things are the ones that tell your story.",
    cta: "Explore the collection"
  }
} as const;

export default function AboutPage() {
  const { locale } = useLanguage();
  const text = copy[locale];

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-[#fff8f0]">
        <div className="mx-auto grid max-w-[1480px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-20 xl:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-600">{text.eyebrow}</p>
            <h1 className="mt-5 max-w-xl font-serif text-5xl font-bold leading-[1.02] text-ink sm:text-6xl">{text.title}</h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-cocoa">{text.intro[0]}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/shop" className="bg-orange-600 text-white hover:bg-orange-700">
                {text.cta} <FiArrowRight />
              </LinkButton>
              <LinkButton href="/contact" variant="secondary">Contact</LinkButton>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-xl bg-ink shadow-2xl">
            <Image src="/images/bannerhero.png" alt="Deluna personalized studio" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-200">Deluna Studio</p>
              <p className="mt-2 max-w-md text-2xl font-black leading-tight">{text.close}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1180px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[280px_1fr] lg:py-20">
        <aside>
          <div className="sticky top-28 grid gap-3">
            {[
              ["Creative", FiPenTool],
              ["Personal", FiHeart],
              ["Giftable", FiStar]
            ].map(([label, Icon]) => (
              <div key={String(label)} className="flex items-center gap-3 border-b border-orange-100 py-4 font-black text-ink">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-orange-50 text-orange-600"><Icon /></span>
                {String(label)}
              </div>
            ))}
          </div>
        </aside>

        <div>
          <div className="space-y-5 text-lg leading-9 text-cocoa">
            {[...text.intro.slice(1), ...text.body].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="mt-10 border-l-4 border-orange-500 bg-[#fff8f0] p-6">
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-orange-700"><FiStar /> Mission</p>
            <p className="mt-4 text-2xl font-black leading-9 text-ink">{text.mission}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
