"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiChevronDown, FiSearch, FiShoppingBag, FiUser } from "react-icons/fi";
import { readCart } from "@/lib/cart";
import { getCurrentUser, logoutDemoUser } from "@/lib/demo-auth";
import { categoryDescriptions, categoryImages, categoryLabels } from "@/lib/products";
import { useLanguage } from "@/components/language-provider";
import type { Category } from "@/types";

export function SiteHeader() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"customer" | "admin" | "guest">("guest");
  const { locale, setLocale, t } = useLanguage();
  const categories = Object.entries(categoryLabels) as Array<[Category, string]>;

  useEffect(() => {
    const sync = () => {
      setCount(readCart().reduce((total, item) => total + item.quantity, 0));
      const user = getCurrentUser();
      setName(user?.name || window.localStorage.getItem("deluna_profile_name") || "");
      setRole(user?.role || (window.localStorage.getItem("deluna_profile_role") as "customer" | "admin" | null) || "guest");
    };
    sync();
    window.addEventListener("deluna-cart", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("deluna-auth", sync);
    return () => {
      window.removeEventListener("deluna-cart", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("deluna-auth", sync);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-2 px-4 py-2 text-xs font-semibold sm:grid-cols-3 sm:px-6">
          <span>🚚 {t("freeShipping")}</span>
          <span className="hidden text-center sm:block">✓ {t("guarantee")}</span>
          <span className="hidden text-right sm:block">💬 {t("support")}</span>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo-deluna-studio.png" alt="Deluna Studio" width={52} height={52} className="h-11 w-11 rounded-full object-cover" />
          <span className="hidden text-lg font-bold tracking-[0.18em] text-ink sm:block">DELUNA</span>
        </Link>

        <nav className="hidden items-center justify-center gap-7 text-sm font-medium text-cocoa lg:flex">
          <Link href="/shop">{t("shop")}</Link>
          <div className="relative">
            <button onClick={() => setOpen((value) => !value)} className="flex items-center gap-1 rounded-full px-3 py-2 hover:bg-linen">
              {t("categories")} <FiChevronDown className={open ? "rotate-180" : ""} />
            </button>
            {open ? (
              <div className="absolute left-1/2 top-11 grid w-[760px] -translate-x-1/2 grid-cols-[220px_1fr] overflow-hidden rounded-lg border border-black/10 bg-white shadow-soft">
                <div className="bg-linen p-3">
                  {categories.map(([key, label]) => (
                    <Link key={key} href={`/shop?category=${key}`} className="flex items-center gap-3 rounded-md px-3 py-3 font-semibold hover:bg-white" onClick={() => setOpen(false)}>
                      <span className="relative h-10 w-10 overflow-hidden rounded-full bg-white">
                        <Image src={categoryImages[key]} alt={label} fill className="object-cover" />
                      </span>
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 p-5">
                  {categories.map(([key, label]) => (
                    <Link key={key} href={`/shop?category=${key}`} onClick={() => setOpen(false)} className="overflow-hidden rounded-lg border border-black/10 bg-white hover:border-champagne">
                      <span className="relative block h-24 bg-linen">
                        <Image src={categoryImages[key]} alt={label} fill className="object-cover" />
                      </span>
                      <span className="block p-3">
                        <span className="block font-semibold text-ink">{label}</span>
                        <span className="mt-1 line-clamp-2 block text-xs leading-5 text-cocoa">{categoryDescriptions[key]}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <Link href="/shop?best=1">{t("bestSellers")}</Link>
          <Link href="/about">{t("about")}</Link>
          <Link href="/contact">{t("contact")}</Link>
        </nav>

        <div className="flex items-center justify-end gap-2">
          <form action="/shop" className="hidden min-w-[320px] items-center rounded-full border border-black/20 bg-white px-3 py-2 xl:flex">
            <input name="q" placeholder={t("searchPlaceholder")} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
            <button aria-label="Search" className="rounded-full bg-ink p-2 text-white"><FiSearch /></button>
          </form>
          <button onClick={() => setLocale(locale === "nl" ? "en" : "nl")} className="rounded-full border border-black/10 px-3 py-2 text-xs font-bold uppercase">
            {locale}
          </button>
          <div className="relative hidden sm:block">
            <button onClick={() => setAccountOpen((value) => !value)} className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-linen">
              {name || t("account")}
            </button>
            {accountOpen ? (
              <div className="absolute right-0 top-11 w-56 overflow-hidden rounded-lg border border-black/10 bg-white py-2 shadow-soft">
                {name ? (
                  <>
                    <div className="border-b border-black/10 px-4 py-3">
                      <p className="font-semibold text-ink">{name}</p>
                      <p className="text-xs capitalize text-cocoa">{role}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-3 text-sm hover:bg-linen" onClick={() => setAccountOpen(false)}>Profile</Link>
                    <Link href="/orders" className="block px-4 py-3 text-sm hover:bg-linen" onClick={() => setAccountOpen(false)}>Order history</Link>
                    {role === "admin" ? <Link href="/admin" className="block px-4 py-3 text-sm font-semibold hover:bg-linen" onClick={() => setAccountOpen(false)}>Admin dashboard</Link> : null}
                    <button
                      className="block w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-linen"
                      onClick={() => {
                        logoutDemoUser();
                        setAccountOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-3 text-sm hover:bg-linen">Login</Link>
                    <Link href="/login?mode=signup" className="block px-4 py-3 text-sm hover:bg-linen">Create account</Link>
                  </>
                )}
              </div>
            ) : null}
          </div>
          <Link className="rounded-md p-2 hover:bg-linen sm:hidden" href="/shop" aria-label="Search products"><FiSearch size={20} /></Link>
          <Link className="rounded-md p-2 hover:bg-linen" href={name ? "/profile" : "/login"} aria-label="Account"><FiUser size={20} /></Link>
          <Link className="relative rounded-md p-2 hover:bg-linen" href="/cart" aria-label="Cart">
            <FiShoppingBag size={20} />
            {count > 0 ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] text-white">{count}</span> : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
