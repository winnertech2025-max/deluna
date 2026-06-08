"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiArrowRight, FiInstagram, FiMail, FiMapPin, FiShield, FiTruck } from "react-icons/fi";
import { useLanguage } from "@/components/language-provider";

export function SiteFooter() {
  const { locale, t } = useLanguage();
  const [message, setMessage] = useState("");

  async function subscribe(formData: FormData) {
    setMessage("");
    const email = String(formData.get("email") || "");
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale, source: "footer" })
    });
    setMessage(response.ok ? "Thank you. You are subscribed." : "Please enter a valid email address.");
  }

  return (
    <footer className="border-t border-black/10 bg-[#1b120b] text-white">
      <div className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 xl:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center gap-4">
              <Image src="/images/logo-deluna-studio.png" alt="Deluna Studio" width={64} height={64} className="h-16 w-16 rounded-full object-cover" />
              <div>
                <p className="text-xl font-bold tracking-[0.22em]">DELUNA</p>
                <p className="mt-1 text-sm uppercase tracking-[0.2em] text-champagne">Customized your pieces</p>
              </div>
            </div>
            <p className="mt-6 max-w-xl leading-7 text-white/72">{t("footerTagline")}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <span className="flex items-center gap-2 rounded-md bg-white/[0.06] px-4 py-3 text-sm"><FiTruck /> 10-14 business days</span>
              <span className="flex items-center gap-2 rounded-md bg-white/[0.06] px-4 py-3 text-sm"><FiShield /> Secure payment</span>
              <span className="flex items-center gap-2 rounded-md bg-white/[0.06] px-4 py-3 text-sm"><FiMapPin /> EU custom studio</span>
            </div>
          </div>

          <div className="rounded-lg bg-champagne p-6 text-ink">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cocoa">{t("newsletterTitle")}</p>
            <h2 className="mt-3 text-3xl font-semibold">{t("footerMessage")}</h2>
            <p className="mt-3 text-sm leading-6 text-cocoa">{t("newsletterText")}</p>
            <form action={subscribe} className="mt-6 flex gap-2 rounded-full bg-white p-2">
              <input name="email" type="email" required placeholder={t("emailPlaceholder")} className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" />
              <button className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
                {t("subscribe")} <FiArrowRight />
              </button>
            </form>
            {message ? <p className="mt-3 text-sm font-semibold text-cocoa">{message}</p> : null}
          </div>
        </div>

        <div className="mt-10 grid gap-8 border-t border-white/10 pt-8 text-sm text-white/70 md:grid-cols-4">
          <div>
            <p className="font-semibold text-white">Studio</p>
            <p className="mt-3 leading-6">{t("footerStudioText")}</p>
          </div>
          <div className="grid gap-2">
            <p className="font-semibold text-white">{t("shop")}</p>
            <Link href="/shop" className="hover:text-white">{t("customProducts")}</Link>
            <Link href="/shop?best=1" className="hover:text-white">{t("bestSellers")}</Link>
            <Link href="/orders" className="hover:text-white">{t("orderTracking")}</Link>
          </div>
          <div className="grid gap-2">
            <p className="font-semibold text-white">Support</p>
            <Link href="/contact" className="hover:text-white">{t("contact")}</Link>
            <Link href="/about" className="hover:text-white">{t("about")}</Link>
            <Link href="/policy" className="hover:text-white">Return & Refund Policy</Link>
            <Link href="/shipping" className="hover:text-white">Shipping Policy</Link>
            <Link href="/admin" className="hover:text-white">Admin portal</Link>
          </div>
          <div>
            <p className="font-semibold text-white">Social</p>
            <div className="mt-3 flex gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10"><FiInstagram /></span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10"><FiMail /></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
