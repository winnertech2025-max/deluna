"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiChevronDown, FiMessageCircle, FiSearch, FiShoppingBag, FiTruck, FiUser } from "react-icons/fi";
import { readCart } from "@/lib/cart";
import { categoryMenu } from "@/lib/category-menu";
import { getCurrentUser, logoutDemoUser } from "@/lib/demo-auth";
import { useLanguage } from "@/components/language-provider";

export function SiteHeader() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"customer" | "admin" | "guest">("guest");
  const { locale, setLocale, t } = useLanguage();

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
      <div className="border-b border-orange-200 bg-[#fff7ed] text-ink">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 overflow-x-auto px-3 py-2 text-[11px] font-bold sm:justify-between sm:px-6 sm:text-xs">
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-orange-100">
            <FiTruck className="text-orange-600" /> {t("freeShipping")}
          </span>
          <span className="hidden shrink-0 items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-orange-100 sm:inline-flex">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-orange-500 text-[10px] text-white">✓</span> {t("guarantee")}
          </span>
          <span className="hidden shrink-0 items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-orange-100 md:inline-flex">
            <FiMessageCircle className="text-orange-600" /> {t("support")}
          </span>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo-deluna-studio.png" alt="Deluna Studio" width={52} height={52} className="h-10 w-10 rounded-full object-cover ring-2 ring-orange-100 sm:h-11 sm:w-11" />
          <span className="hidden text-lg font-bold tracking-[0.18em] text-ink sm:block">DELUNA</span>
        </Link>

        <nav className="hidden items-center justify-center gap-7 text-sm font-medium text-cocoa lg:flex">
          <Link href="/shop">{t("shop")}</Link>
          <div className="relative">
            <button onClick={() => setOpen((value) => !value)} className="flex items-center gap-1 rounded-full px-3 py-2 hover:bg-linen">
              {t("categories")} <FiChevronDown className={open ? "rotate-180" : ""} />
            </button>
            {open ? (
              <div className="absolute left-1/2 top-11 w-[960px] -translate-x-1/2 rounded-md border border-black/10 bg-white px-8 py-7 shadow-soft">
                <div className="grid grid-cols-6 gap-7">
                {categoryMenu.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.slug} className="min-w-0">
                      <Link href={`/shop?category=${group.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-[0.08em] text-ink hover:text-orange-700">
                        <Icon className="h-4 w-4 text-orange-600" />
                        <span className="leading-5">{group.label.replace("Personalized ", "")}</span>
                      </Link>
                      <div className="mt-4 grid gap-2">
                        {group.children.map(([slug, label]) => (
                          <Link key={slug} href={`/shop?category=${slug}`} onClick={() => setOpen(false)} className="block text-[13px] leading-5 text-cocoa transition hover:text-orange-700">
                            {label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
                </div>
                <div className="mt-7 flex items-center justify-between border-t border-black/10 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa">Choose it. Personalize it. Make it yours.</p>
                  <Link href="/shop?best=1" onClick={() => setOpen(false)} className="rounded-full bg-ink px-5 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-orange-600">
                    Best sellers
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
          <Link href="/shop?best=1">{t("bestSellers")}</Link>
          <Link href="/about">{t("about")}</Link>
          <Link href="/contact">{t("contact")}</Link>
        </nav>

        <div className="flex items-center justify-end gap-2">
          <form action="/shop" className="hidden min-w-[320px] items-center rounded-full border border-orange-200 bg-white px-3 py-2 xl:flex">
            <input name="q" placeholder={t("searchPlaceholder")} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
            <button aria-label="Search" className="rounded-full bg-champagne p-2 text-ink"><FiSearch /></button>
          </form>
          <button onClick={() => setLocale(locale === "nl" ? "en" : "nl")} className="rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold uppercase">
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
          <Link className="rounded-md p-2 hover:bg-orange-50 sm:hidden" href="/shop" aria-label="Search products"><FiSearch size={20} /></Link>
          <Link className="rounded-md p-2 hover:bg-orange-50" href={name ? "/profile" : "/login"} aria-label="Account"><FiUser size={20} /></Link>
          <Link className="relative rounded-md p-2 hover:bg-orange-50" href="/cart" aria-label="Cart">
            <FiShoppingBag size={20} />
            {count > 0 ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-champagne px-1 text-[11px] font-bold text-ink">{count}</span> : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
