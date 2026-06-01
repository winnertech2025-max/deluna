import { Button } from "@/components/button";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cocoa">Contact</p>
      <h1 className="mt-4 text-5xl font-semibold text-ink">Need help with a custom order?</h1>
      <form className="mt-8 grid gap-4 rounded-lg border border-black/10 bg-white p-6 shadow-soft">
        <input className="focus-ring rounded-md border border-black/15 px-4 py-3" placeholder="Name" />
        <input className="focus-ring rounded-md border border-black/15 px-4 py-3" placeholder="Email" />
        <textarea className="focus-ring rounded-md border border-black/15 px-4 py-3" rows={6} placeholder="Tell us what you want to personalize" />
        <Button className="w-fit">Send message</Button>
      </form>
    </div>
  );
}
