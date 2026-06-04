"use client";

import { useState, type FormEvent } from "react";
import { FiMail, FiMapPin, FiMessageCircle } from "react-icons/fi";
import { Button } from "@/components/button";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message")
      })
    });

    if (!response.ok) {
      setStatus("error");
      setMessage("We could not send your message. Please try again or email hello@delunastudio.nl.");
      return;
    }

    event.currentTarget.reset();
    setStatus("sent");
    setMessage("Your message has been sent. We also emailed you a confirmation.");
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.82fr_1.18fr]">
      <section className="rounded-lg bg-ink p-8 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-champagne">Contact</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">Need help with a custom order?</h1>
        <p className="mt-5 leading-7 text-white/75">
          Send us your idea, name placement, product question or order request. Deluna will reply from hello@delunastudio.nl.
        </p>
        <div className="mt-8 grid gap-3 text-sm">
          <span className="flex items-center gap-3 rounded-md bg-white/10 p-4"><FiMail /> hello@delunastudio.nl</span>
          <span className="flex items-center gap-3 rounded-md bg-white/10 p-4"><FiMessageCircle /> Custom product support</span>
          <span className="flex items-center gap-3 rounded-md bg-white/10 p-4"><FiMapPin /> Netherlands focused studio</span>
        </div>
      </section>

      <form onSubmit={submit} className="grid gap-4 rounded-lg border border-black/10 bg-white p-5 shadow-soft sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-ink">
            Name
            <input name="name" required className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" placeholder="Your name" />
          </label>
          <label className="text-sm font-semibold text-ink">
            Email
            <input name="email" type="email" required className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" placeholder="you@email.com" />
          </label>
        </div>
        <label className="text-sm font-semibold text-ink">
          Message
          <textarea name="message" required className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" rows={7} placeholder="Tell us what you want to personalize" />
        </label>
        <Button disabled={status === "sending"} className="w-full sm:w-fit">
          {status === "sending" ? "Sending..." : "Send message"}
        </Button>
        {message ? (
          <p className={`rounded-md p-3 text-sm ${status === "error" ? "bg-red-50 text-red-700" : "bg-orange-50 text-cocoa"}`}>
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
