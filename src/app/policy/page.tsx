"use client";

import { FiMail, FiRotateCcw } from "react-icons/fi";
import { useLanguage } from "@/components/language-provider";

const content = {
  nl: {
    eyebrow: "Beleid",
    title: "Retour- en terugbetalingsbeleid",
    intro: "Bij Deluna Studio zijn de meeste producten gepersonaliseerd en speciaal gemaakt voor iedere klant. Daarom accepteren wij geen retouren, ruilingen of annuleringen voor gepersonaliseerde items zodra de bestelling is geplaatst en de productie is gestart.",
    sections: [
      {
        title: "Gepersonaliseerde producten die niet retourneerbaar zijn",
        body: [
          "Dit omvat producten met namen, initialen, persoonlijke tekst, datums, geboortestenen, aangepaste kleuren, gravures, prints of andere keuzes die volgens verzoek van de klant zijn gemaakt.",
          "Gepersonaliseerde producten kunnen niet worden geretourneerd of terugbetaald omdat je van gedachten verandert, een verkeerde naam, spelling, maat, kleur of tekst hebt ingevoerd, of omdat het item correct is gemaakt op basis van de informatie bij checkout."
        ]
      },
      {
        title: "Beschadigde, defecte of verkeerde items",
        body: [
          "Als je item beschadigd, defect of anders aankomt dan besteld, helpen wij graag. Neem binnen 48 uur na ontvangst contact met ons op via hello@delunastudio.nl.",
          "Vermeld je ordernummer, duidelijke foto's of video's van het probleem en een korte uitleg. Als het probleem wordt bevestigd, kunnen we een vervanging, reparatie, gedeeltelijke terugbetaling of volledige terugbetaling aanbieden."
        ]
      },
      {
        title: "Fouten in personalisatie door de klant",
        body: [
          "Wij zijn niet verantwoordelijk voor fouten die tijdens checkout door de klant zijn ingevoerd, zoals spelfouten, verkeerde initialen, datum, naam, maat, kleur of lettertype.",
          "Als je direct na het plaatsen van je bestelling een fout ziet, neem dan zo snel mogelijk contact op. Als productie nog niet is gestart, proberen wij dit aan te passen, maar wijzigingen kunnen niet worden gegarandeerd."
        ]
      },
      {
        title: "Kleine variaties en levering",
        body: [
          "Omdat veel producten gepersonaliseerd of op maat gemaakt zijn, kunnen kleine verschillen voorkomen in kleur, plaatsing, maat of materiaal. Deze kleine variaties worden niet gezien als defecten.",
          "Deluna Studio is niet verantwoordelijk voor verkeerde levering door een onjuist of onvolledig adres dat door de klant is opgegeven."
        ]
      },
      {
        title: "Retourzending en annulering",
        body: [
          "Als een retour is goedgekeurd vanwege schade, defect of een verkeerd item, sturen wij retourinstructies. Stuur geen item terug zonder eerst contact met ons op te nemen.",
          "Annuleren is alleen mogelijk als productie nog niet is gestart. Zodra productie is gestart, kan de bestelling niet meer worden geannuleerd."
        ]
      }
    ],
    contact: "Voor retour- of orderproblemen: hello@delunastudio.nl"
  },
  en: {
    eyebrow: "Policy",
    title: "Return & Refund Policy",
    intro: "At Deluna Studio, most of our products are personalized and made especially for each customer. Because of this, we do not accept returns, exchanges, or cancellations for personalized items once the order has been placed and production has started.",
    sections: [
      {
        title: "Non-returnable personalized products",
        body: [
          "This includes products with custom names, initials, personal text, dates, birthstones, custom colors, engraved items, printed items, or any product made according to the customer's request.",
          "Personalized products cannot be returned or refunded simply because you changed your mind, ordered the wrong name, spelling, size, color or text, or no longer want the product."
        ]
      },
      {
        title: "Damaged, defective, or incorrect items",
        body: [
          "If your item arrives damaged, defective, or different from what you ordered, we will help you. Please contact us within 48 hours after receiving your order at hello@delunastudio.nl.",
          "Include your order number, clear photos or videos of the issue, and a short explanation. If the issue is confirmed, we may offer replacement, repair, partial refund, or full refund depending on the situation."
        ]
      },
      {
        title: "Incorrect personalization caused by the customer",
        body: [
          "We are not responsible for mistakes entered by the customer during checkout, such as spelling mistakes, wrong initials, wrong date, wrong name, wrong size, wrong color choice, or wrong font choice.",
          "If you notice a mistake immediately after placing your order, please contact us as soon as possible. If production has not started yet, we will do our best to adjust it, but changes cannot be guaranteed."
        ]
      },
      {
        title: "Small variations and delivery issues",
        body: [
          "Because many products are personalized or custom-made, small variations may occur, including slight color differences, small placement differences, minor size differences, or natural differences in materials.",
          "Deluna Studio is not responsible for incorrect delivery caused by an incorrect or incomplete address provided by the customer."
        ]
      },
      {
        title: "Return shipping and cancellation",
        body: [
          "If a return is approved because the item is damaged, defective, or incorrect, we will provide return instructions. Please do not send any item back without contacting us first.",
          "Cancellations are only possible if production has not started yet. Once production has started, the order can no longer be cancelled."
        ]
      }
    ],
    contact: "For return or order issues: hello@delunastudio.nl"
  }
} as const;

export default function PolicyPage() {
  const { locale } = useLanguage();
  const text = content[locale];

  return (
    <main className="bg-white">
      <section className="border-b border-orange-100 bg-[#fff8f0]">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-orange-600"><FiRotateCcw /> {text.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-ink sm:text-5xl">{text.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-cocoa">{text.intro}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[240px_1fr] lg:py-16">
        <aside className="hidden lg:block">
          <div className="sticky top-28 border-l border-orange-200 pl-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cocoa">On this page</p>
            <div className="mt-4 grid gap-3">
              {text.sections.map((section) => (
                <a key={section.title} href={`#${section.title.toLowerCase().replaceAll(" ", "-")}`} className="text-sm font-semibold leading-5 text-cocoa hover:text-orange-600">
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        </aside>

        <article className="prose-policy">
          <div className="divide-y divide-orange-100 border-y border-orange-100">
            {text.sections.map((section) => (
              <section key={section.title} id={section.title.toLowerCase().replaceAll(" ", "-")} className="py-8 first:pt-0 last:pb-0">
                <h2 className="text-2xl font-black leading-tight text-ink">{section.title}</h2>
                <div className="mt-4 space-y-4 text-base leading-8 text-cocoa">
                  {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </section>
            ))}
          </div>
          <div className="mt-8 border-l-4 border-orange-500 bg-[#fff8f0] p-5">
            <p className="flex items-center gap-2 font-bold text-ink"><FiMail /> {text.contact}</p>
          </div>
        </article>
      </section>
    </main>
  );
}
