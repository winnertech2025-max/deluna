"use client";

import { FiClock, FiMail, FiPackage, FiTruck } from "react-icons/fi";
import { useLanguage } from "@/components/language-provider";

const content = {
  nl: {
    eyebrow: "Verzending",
    title: "Verzendbeleid",
    intro: "Alle producten van Deluna Studio worden speciaal voor iedere klant gemaakt of gepersonaliseerd. Daarom hebben bestellingen verwerkingstijd nodig voordat ze worden verzonden.",
    cards: [
      ["Verwerkingstijd", "7-10 werkdagen, afhankelijk van product, personalisatie en ordervolume."],
      ["Nederland", "EUR4,95 verzending onder EUR49. Gratis verzending vanaf EUR49. Levertijd 1-3 werkdagen na verzending."],
      ["Belgie en Duitsland", "EUR6,95 verzending onder EUR69. Gratis verzending vanaf EUR69. Levertijd 2-5 werkdagen na verzending."],
      ["Frankrijk en EU", "FR: EUR7,95 onder EUR69. Rest van Europa: EUR9,95 onder EUR99. Gratis boven de drempel."]
    ],
    sections: [
      ["Drukke periodes", "Tijdens drukke periodes, feestdagen of speciale promoties kan de verwerkingstijd iets langer zijn."],
      ["Tracking", "Zodra je bestelling is verzonden, ontvang je een verzendbevestiging per email met trackinginformatie indien beschikbaar. Het kan tot 48 uur duren voordat trackingupdates zichtbaar zijn."],
      ["Onjuiste verzendinformatie", "Klanten zijn verantwoordelijk voor juiste verzendgegevens. Deluna Studio is niet verantwoordelijk voor vertragingen, verloren pakketten of extra verzendkosten door een verkeerd of onvolledig adres."],
      ["Vertraagde levering", "Wij doen ons best om de geschatte levertijden te halen, maar vertragingen kunnen voorkomen. Een vertraagde zending geeft niet automatisch recht op terugbetaling als de bestelling nog onderweg is en uiteindelijk wordt geleverd."],
      ["Verloren of beschadigde pakketten", "Als je pakket beschadigd aankomt of verloren lijkt, neem dan binnen 48 uur na levering of de verwachte leverdatum contact op. Vermeld je ordernummer, foto's van schade en een korte uitleg."],
      ["Gepersonaliseerde producten", "Verzendtijd omvat zowel productietijd als levertijd. Door een bestelling te plaatsen, accepteer je deze productie- en levertijden."]
    ],
    contact: "Voor verzendvragen: hello@delunastudio.nl"
  },
  en: {
    eyebrow: "Shipping",
    title: "Shipping Policy",
    intro: "All Deluna Studio products are made or personalized specifically for each customer. Because of this, orders require processing time before shipping.",
    cards: [
      ["Processing time", "7-10 business days depending on the product, personalization requirements, and order volume."],
      ["Netherlands", "EUR4.95 shipping below EUR49. Free shipping from EUR49. Delivery is 1-3 business days after shipping."],
      ["Belgium and Germany", "EUR6.95 shipping below EUR69. Free shipping from EUR69. Delivery is 2-5 business days after shipping."],
      ["France and EU", "FR: EUR7.95 below EUR69. Rest of Europe: EUR9.95 below EUR99. Free above the threshold."]
    ],
    sections: [
      ["Busy periods", "During busy periods, holidays, or special promotions, processing times may be slightly longer."],
      ["Order tracking", "Once your order has been shipped, you will receive a shipping confirmation email with tracking information if available. Please allow up to 48 hours for tracking updates to appear."],
      ["Incorrect shipping information", "Customers are responsible for providing accurate shipping information. Deluna Studio is not responsible for delays, lost packages, or additional shipping costs resulting from incorrect or incomplete addresses."],
      ["Delayed deliveries", "While we always strive to meet our estimated delivery times, occasional delays may occur. A delayed shipment does not automatically qualify for a refund if the order is still in transit and eventually delivered."],
      ["Lost or damaged packages", "If your package arrives damaged or appears to be lost during transit, please contact us within 48 hours of delivery or the expected delivery date. Include your order number, photos of any damage, and a description of the issue."],
      ["Personalized products", "Shipping times include both production time and delivery time. By placing an order, you acknowledge and accept these production and delivery timelines."]
    ],
    contact: "For shipping questions: hello@delunastudio.nl"
  }
} as const;

export default function ShippingPage() {
  const { locale } = useLanguage();
  const text = content[locale];

  return (
    <main className="bg-white">
      <section className="border-b border-orange-100 bg-[#fff8f0]">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-orange-600"><FiTruck /> {text.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-ink sm:text-5xl">{text.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-cocoa">{text.intro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="overflow-hidden border-y border-orange-100">
          {text.cards.map(([title, body], index) => (
            <div key={title} className="grid gap-3 border-b border-orange-100 py-5 last:border-b-0 sm:grid-cols-[220px_1fr] sm:gap-8">
              <h2 className="flex items-center gap-2 font-black text-ink">
                {index === 0 ? <FiClock className="text-orange-500" /> : <FiTruck className="text-orange-500" />}
                {title}
              </h2>
              <p className="leading-7 text-cocoa">{body}</p>
            </div>
          ))}
        </div>

        <article className="mt-12 grid gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 border-l border-orange-200 pl-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cocoa">Details</p>
              <div className="mt-4 grid gap-3">
                {text.sections.map(([title]) => (
                  <a key={title} href={`#${title.toLowerCase().replaceAll(" ", "-")}`} className="text-sm font-semibold leading-5 text-cocoa hover:text-orange-600">
                    {title}
                  </a>
                ))}
              </div>
            </div>
          </aside>
          <div className="divide-y divide-orange-100 border-y border-orange-100">
            {text.sections.map(([title, body]) => (
              <section key={title} id={title.toLowerCase().replaceAll(" ", "-")} className="py-8 first:pt-0 last:pb-0">
                <h2 className="flex items-center gap-2 text-2xl font-black leading-tight text-ink"><FiPackage className="text-orange-500" /> {title}</h2>
                <p className="mt-4 leading-8 text-cocoa">{body}</p>
              </section>
            ))}
            <div className="mt-8 border-l-4 border-orange-500 bg-[#fff8f0] p-5">
              <p className="flex items-center gap-2 font-bold text-ink"><FiMail /> {text.contact}</p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
