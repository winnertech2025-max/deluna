"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  FiCheck,
  FiImage,
  FiMinus,
  FiPlus,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTruck,
  FiZap
} from "react-icons/fi";
import { Button } from "@/components/button";
import { useLanguage } from "@/components/language-provider";
import { readCart, writeCart } from "@/lib/cart";
import { formatEUR } from "@/lib/money";
import type { Product } from "@/types";

const copy = {
  nl: {
    studioDeal: "Studio deal",
    freePersonalization: "Gratis personalisatie",
    inStock: "Op voorraad",
    variant: "Variant",
    nameLabel: "Naam, tekst of initialen",
    example: "Bijv. Luna, Chloé, C.P.",
    placement: "Plaatsing",
    maximum: "Maximaal",
    characters: "tekens",
    font: "Lettertype",
    color: "Kleur",
    quantity: "Aantal",
    minus: "Aantal verlagen",
    plus: "Aantal verhogen",
    aiPreview: "Gratis AI-preview maken",
    generating: "Preview maken...",
    delivery: "Verwachte levering",
    deliveryNote: "Controleer naam, lettertype, kleur en preview zorgvuldig voordat je bestelt.",
    modalTitle: "Maak het persoonlijk",
    modalIntro: "Vul de naam, tekst of initialen in die op dit product moeten komen.",
    modalPreviewIntro: "Vul eerst je naam in. Daarna maken we direct een AI-preview in dit venster.",
    modalLoading: "AI ontwerpt jouw preview, wacht heel even...",
    confirmAdd: "Toevoegen aan winkelmand",
    confirmBuy: "Verder naar afrekenen",
    close: "Sluiten",
    out: "Uitverkocht",
    added: "Toegevoegd aan je winkelmand.",
    enterName: "Vul eerst een naam, tekst of initialen in.",
    sold: "verkocht",
    reviews: "reviews",
    freeShipping: "Gratis verzending volgens landregels",
    safePayments: "Veilig betalen met Mollie, PayPal of COD",
    guarantee: "Preview voor productie",
    gallery: "Productgalerij",
    productInfo: "Productinformatie",
    customDetails: "Personalisatie",
    customerReview: "Klantbeoordeling",
    reviewBody: "Klanten waarderen vooral de persoonlijke afwerking, duidelijke preview en zorgvuldige verpakking.",
    included: "Inbegrepen",
    previewIncluded: "Gratis AI-preview voor productie",
    handmade: "Gemaakt op bestelling",
    giftReady: "Cadeauwaardig verpakt"
  },
  en: {
    studioDeal: "Studio deal",
    freePersonalization: "Free personalization",
    inStock: "In stock",
    variant: "Variant",
    nameLabel: "Name, text, or initials",
    example: "Example: Luna, Chloe, C.P.",
    placement: "Placement",
    maximum: "Maximum",
    characters: "characters",
    font: "Font",
    color: "Color",
    quantity: "Quantity",
    minus: "Decrease quantity",
    plus: "Increase quantity",
    aiPreview: "Create free AI preview",
    generating: "Generating preview...",
    delivery: "Delivery estimate",
    deliveryNote: "Check the name, font, color and preview carefully before ordering.",
    modalTitle: "Make it personal",
    modalIntro: "Enter the name, text or initials you want on this product.",
    modalPreviewIntro: "Enter your name first. Then we will create the AI preview inside this window.",
    modalLoading: "AI is designing your preview, please wait a moment...",
    confirmAdd: "Add to cart",
    confirmBuy: "Continue to checkout",
    close: "Close",
    out: "Out of stock",
    added: "Added to your bag.",
    enterName: "Please enter a name, text or initials first.",
    sold: "sold",
    reviews: "reviews",
    freeShipping: "Free shipping by country rules",
    safePayments: "Secure payments with Mollie, PayPal or COD",
    guarantee: "Preview before production",
    gallery: "Product gallery",
    productInfo: "Product information",
    customDetails: "Personalization",
    customerReview: "Customer review",
    reviewBody: "Customers especially love the personal finish, clear preview and careful packaging.",
    included: "Included",
    previewIncluded: "Free AI preview before production",
    handmade: "Made to order",
    giftReady: "Gift-ready packaging"
  }
} as const;

export function ProductCustomizer({ product }: { product: Product }) {
  const defaultVariant = product.variants.find((variant) => variant.isDefault) || product.variants[0];
  const [variantId, setVariantId] = useState(defaultVariant.id);
  const [engravingText, setEngravingText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [previewError, setPreviewError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(product.gallery[0] || product.image);
  const [modalAction, setModalAction] = useState<"preview" | "cart" | "checkout" | null>(null);
  const { locale, t } = useLanguage();
  const text = copy[locale];
  const out = product.status === "out_of_stock";
  const font = product.personalization.fonts[0] || "Serif";
  const color = product.personalization.colors[0] || "Champagne Gold";

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === variantId) || defaultVariant,
    [defaultVariant, product.variants, variantId]
  );
  const gallery = useMemo(() => Array.from(new Set([product.image, ...product.gallery])), [product.gallery, product.image]);
  const displayImage = previewUrl || activeImage || product.image;
  const trustItems = [
    { icon: FiTruck, label: text.freeShipping },
    { icon: FiShield, label: text.safePayments },
    { icon: FiCheck, label: text.guarantee }
  ];
  const detailCards = [
    { title: text.productInfo, body: product.description },
    { title: text.customDetails, body: `${text.previewIncluded}. ${text.handmade}. ${text.giftReady}.` },
    { title: text.customerReview, body: text.reviewBody }
  ];

  function hasPersonalization() {
    if (!engravingText.trim()) {
      setPreviewError(text.enterName);
      return false;
    }
    setPreviewError("");
    return true;
  }

  async function generatePreview() {
    if (!hasPersonalization()) return;
    setLoadingPreview(true);
    setPreviewError("");
    try {
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          image: activeImage || product.gallery[0] || product.image,
          engravingText: engravingText.trim(),
          font,
          color,
          placement: product.personalization.placement
        })
      });
      const data = (await response.json()) as { previewUrl?: string; error?: string };
      if (!response.ok || !data.previewUrl) throw new Error(data.error || "Could not generate preview.");
      setPreviewUrl(data.previewUrl);
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : "Could not generate preview.");
    } finally {
      setLoadingPreview(false);
    }
  }

  function openPersonalization(action: "preview" | "cart" | "checkout") {
    if (out) return;
    setModalAction(action);
    setPreviewError("");
    setAdded(false);
  }

  function addToCart() {
    if (!hasPersonalization() || out) return false;
    const item = {
      product,
      variantId,
      quantity,
      engravingText: engravingText.trim(),
      font,
      color,
      previewUrl
    };
    writeCart([...readCart(), item]);
    setAdded(true);
    return true;
  }

  function handleModalConfirm() {
    if (modalAction === "preview") {
      void generatePreview();
      return;
    }
    if (!addToCart()) return;
    setModalAction(null);
    if (modalAction === "checkout") window.location.href = "/checkout";
  }

  return (
    <div className="space-y-7">
      <div className="grid gap-7 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
        <section className="space-y-4" aria-label={text.gallery}>
          <div className="relative overflow-hidden rounded-[26px] border border-orange-100 bg-[#fff8ef] shadow-[0_18px_44px_rgba(80,44,20,0.10)]">
            <div className="relative aspect-square min-h-[320px] sm:min-h-[500px]">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displayImage} alt={`${product.name} preview`} className="h-full w-full object-cover" />
              ) : (
                <Image src={displayImage} alt={product.name} fill className="object-cover" priority />
              )}
              <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-ink shadow-sm">
                <FiImage className="text-[#E8520A]" />
                  {previewUrl ? "AI preview" : text.freePersonalization}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-2 text-xs font-black text-[#E8520A] shadow-sm">
                  <FiStar fill="currentColor" /> {product.rating?.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {gallery.slice(0, 7).map((image) => (
              <button
                key={image}
                onClick={() => {
                  setActiveImage(image);
                  setPreviewUrl(undefined);
                }}
                className={`relative aspect-square overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-0.5 ${
                  activeImage === image && !previewUrl ? "border-[#E8520A] shadow-[0_0_0_3px_rgba(232,82,10,0.18)]" : "border-black/10"
                }`}
                aria-label={`View ${product.name}`}
              >
                <Image src={image} alt={product.name} fill className="object-cover" />
              </button>
            ))}
          </div>
        </section>

        <aside className="lg:self-start">
          <div className="rounded-[26px] border border-orange-100 bg-white p-5 shadow-[0_18px_44px_rgba(80,44,20,0.08)] sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#E8520A] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-white">{text.studioDeal}</span>
              <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-green-700">{out ? text.out : text.inStock}</span>
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-[#E8520A]">{product.category}</p>
            <h1 className="mt-2 text-3xl font-black leading-[1.05] text-ink sm:text-4xl">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-bold text-cocoa">
              <span className="inline-flex items-center gap-1 text-[#E8520A]">
                <FiStar fill="currentColor" /> {product.rating?.toFixed(1)}
              </span>
              <span className="inline-flex text-[#E8520A]">
                {Array.from({ length: 5 }).map((_, index) => <FiStar key={index} fill="currentColor" />)}
              </span>
              <span className="text-cocoa/70">({product.soldCount} {text.sold})</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-cocoa">{product.description}</p>

            <div className="mt-5 flex flex-wrap items-end gap-3">
              <p className="text-4xl font-black leading-none text-[#E8520A]">{formatEUR(selectedVariant.price)}</p>
              <p className="pb-1 text-sm font-semibold text-cocoa/70 line-through">{formatEUR(selectedVariant.price * 1.22)}</p>
              <span className="mb-0.5 rounded-full border border-[#E8520A] px-2.5 py-1 text-xs font-black text-[#E8520A]">18% OFF</span>
            </div>

            <div className="mt-5">
              <p className="text-sm font-black text-ink">{text.variant}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setVariantId(variant.id)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      variantId === variant.id ? "border-2 border-[#E8520A] bg-[#FFF3EC] shadow-sm" : "border-black/10 bg-white hover:border-[#E8520A]/40"
                    }`}
                  >
                    <span className={`block text-sm font-black ${variantId === variant.id ? "text-[#E8520A]" : "text-ink"}`}>{variant.name}</span>
                    <span className="mt-1 block text-sm font-bold text-cocoa">{formatEUR(variant.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-end">
              <div>
                <p className="text-sm font-black text-ink">{text.quantity}</p>
                <div className="mt-2 inline-flex items-center overflow-hidden rounded-full border border-black/10 bg-white shadow-sm">
                  <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-11 w-11 place-items-center hover:bg-[#FFF3EC]" aria-label={text.minus}>
                    <FiMinus />
                  </button>
                  <span className="min-w-12 text-center text-base font-black">{quantity}</span>
                  <button onClick={() => setQuantity((value) => Math.min(9, value + 1))} className="grid h-11 w-11 place-items-center hover:bg-[#FFF3EC]" aria-label={text.plus}>
                    <FiPlus />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-[#E8520A]/20 bg-[#FFF3EC] px-4 py-3 text-sm leading-6 text-cocoa">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#E8520A]">
                  <FiTruck />
                </span>
                <div>
                  <p className="font-black text-ink">{text.delivery}: {product.deliveryDays}</p>
                  <p className="text-xs">{text.previewIncluded}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {out ? (
                <Button disabled className="w-full rounded-2xl bg-cocoa/40">{text.out}</Button>
              ) : (
                <>
                  <Button onClick={() => openPersonalization("cart")} className="min-h-12 w-full rounded-2xl bg-[#E8520A] text-white hover:bg-[#c84307]">
                    {t("addToCart")} <FiShoppingBag />
                  </Button>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button type="button" variant="secondary" className="min-h-12 w-full rounded-2xl border-[#E8520A]/25 bg-white hover:bg-[#FFF3EC]" onClick={() => openPersonalization("checkout")}>
                      {t("buyNow")} <FiZap />
                    </Button>
                    <Button onClick={() => openPersonalization("preview")} variant="secondary" className="min-h-12 w-full rounded-2xl border-[#E8520A]/25 bg-white hover:bg-[#FFF3EC]">
                      {text.aiPreview} <FiImage />
                    </Button>
                  </div>
                </>
              )}
              {added ? <p className="flex items-center gap-2 text-sm font-black text-green-700"><FiCheck /> {text.added}</p> : null}
            </div>
          </div>
        </aside>
      </div>

      <section className="rounded-[34px] border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {detailCards.map((item) => (
            <article key={item.title} className="rounded-[26px] bg-[#fffaf5] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E8520A]">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-cocoa">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm font-bold text-cocoa shadow-sm">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#FFF3EC] text-[#E8520A]"><Icon /></span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {modalAction ? (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[30px] bg-white shadow-2xl">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.75fr)]">
              <div className="relative min-h-[320px] bg-[#fff7ed] lg:min-h-[560px]">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt={`${product.name} AI preview`} className="h-full w-full object-cover" />
                ) : (
                  <Image src={activeImage || product.image} alt={product.name} fill className="object-cover" />
                )}
                {loadingPreview ? (
                  <div className="absolute inset-0 grid place-items-center bg-black/45 p-6 text-center text-white">
                    <div className="rounded-3xl bg-black/45 px-6 py-5 backdrop-blur">
                      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <p className="text-lg font-black">{text.modalLoading}</p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E8520A]">{text.freePersonalization}</p>
                    <h2 className="mt-2 text-3xl font-black text-ink">{text.modalTitle}</h2>
                    <p className="mt-2 text-sm leading-6 text-cocoa">
                      {modalAction === "preview" ? text.modalPreviewIntro : text.modalIntro}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setModalAction(null);
                      setPreviewError("");
                    }}
                    className="rounded-full border border-black/10 px-4 py-2 text-sm font-bold hover:bg-[#FFF3EC]"
                  >
                    {text.close}
                  </button>
                </div>

                <div className="mt-6 rounded-2xl border border-orange-100 bg-[#fffaf5] p-4">
                  <label htmlFor="modal-engraving" className="text-xs font-black uppercase tracking-[0.12em] text-cocoa">{text.nameLabel}</label>
                  <input
                    id="modal-engraving"
                    autoFocus
                    value={engravingText}
                    onChange={(event) => {
                      setEngravingText(event.target.value.slice(0, product.personalization.maxLength));
                      setAdded(false);
                      setPreviewError("");
                    }}
                    placeholder={text.example}
                    className="focus-ring mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base"
                  />
                  <p className="mt-2 text-xs font-semibold text-cocoa">
                    {text.placement}: {product.personalization.placement}. {text.maximum} {product.personalization.maxLength} {text.characters}.
                  </p>
                </div>

                {previewError ? <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{previewError}</p> : null}

                <div className="mt-6 rounded-2xl bg-[#FFF3EC] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-black text-ink">{product.name}</p>
                      <p className="mt-1 text-sm font-bold text-cocoa">{selectedVariant.name} · {formatEUR(selectedVariant.price)}</p>
                    </div>
                    <p className="text-sm font-black text-[#E8520A]">x{quantity}</p>
                  </div>
                </div>

                <Button onClick={handleModalConfirm} variant="gold" disabled={loadingPreview} className="mt-6 min-h-12 w-full rounded-2xl">
                  {modalAction === "preview" ? (loadingPreview ? text.generating : text.aiPreview) : modalAction === "checkout" ? text.confirmBuy : text.confirmAdd}
                </Button>
                {modalAction === "preview" && previewUrl ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <Button onClick={() => openPersonalization("cart")} className="min-h-12 rounded-2xl">
                      {t("addToCart")} <FiShoppingBag />
                    </Button>
                    <Button type="button" variant="secondary" className="min-h-12 rounded-2xl" onClick={() => openPersonalization("checkout")}>
                      {t("buyNow")} <FiZap />
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
