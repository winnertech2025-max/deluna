import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1fr]">
      <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-ink">
        <Image src="/images/logo-deluna-studio.png" alt="Deluna Studio logo" fill className="object-cover opacity-85" />
      </div>
      <div className="self-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cocoa">Over Deluna / About Deluna</p>
        <h1 className="mt-4 text-5xl font-semibold leading-tight text-ink">A custom studio for pieces with personal meaning.</h1>
        <p className="mt-6 text-lg leading-8 text-cocoa">
          Deluna helps customers turn everyday products into personal gifts through names, initials, phrases, colors, sizes, and visual previews before ordering.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {["Boutique feeling", "Simple buying flow", "Personalized preview", "10-14 business day delivery"].map((item) => (
            <div key={item} className="rounded-lg border border-black/10 bg-white p-4 font-semibold">{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
