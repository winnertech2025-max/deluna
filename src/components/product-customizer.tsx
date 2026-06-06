"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { FiCheck, FiImage, FiShield, FiShoppingBag, FiTruck, FiZap } from "react-icons/fi";
import { Button, LinkButton } from "@/components/button";
import { useLanguage } from "@/components/language-provider";
import { readCart, writeCart } from "@/lib/cart";
import { formatEUR } from "@/lib/money";
import type { Product } from "@/types";

export function ProductCustomizer({ product }: { product: Product }) {
  const defaultVariant = product.variants.find((variant) => variant.isDefault) || product.variants[0];
  const [variantId, setVariantId] = useState(defaultVariant.id);
  const [engravingText, setEngravingText] = useState("");
  const [font, setFont] = useState(product.personalization.fonts[0]);
  const [color, setColor] = useState(product.personalization.colors[0]);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [added, setAdded] = useState(false);
  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === variantId) || defaultVariant,
    [defaultVariant, product.variants, variantId]
  );
  const { t } = useLanguage();
  const out = product.status === "out_of_stock";

  async function generatePreview() {
    setLoadingPreview(true);
    const response = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, image: product.image, engravingText, font, color })
    });
    const data = (await response.json()) as { previewUrl: string };
    setPreviewUrl(data.previewUrl);
    setLoadingPreview(false);
  }

  function addToCart() {
    const item = {
      product,
      variantId,
      quantity,
      engravingText,
      font,
      color,
      previewUrl
    };
    writeCart([...readCart(), item]);
    setAdded(true);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr] lg:gap-8">
      <div className="grid gap-4 lg:grid-cols-[74px_1fr]">
        <div className="hidden space-y-3 lg:block">
          {product.gallery.map((image) => (
            <button key={image} className="relative aspect-square w-full overflow-hidden rounded-md border border-black/10 bg-white">
              <Image src={image} alt={product.name} fill className="object-cover" />
            </button>
          ))}
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-nude/30 shadow-sm">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt={`${product.name} preview`} className="h-full w-full object-cover" />
          ) : (
            <Image src={product.image} alt={product.name} fill className="object-cover" priority />
          )}
          {previewUrl ? (
            <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">AI preview</span>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-3 lg:col-start-2">
          {product.gallery.map((image) => (
            <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white">
              <Image src={image} alt={product.name} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-orange-200 bg-white p-4 shadow-soft sm:p-7">
        <div className="mb-4 flex overflow-hidden rounded-md bg-orange-600 text-xs font-bold text-white sm:text-sm">
          <span className="bg-red-600 px-3 py-2 sm:px-4">Studio deal</span>
          <span className="px-3 py-2 sm:px-4">Free personalization</span>
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cocoa">{product.category}</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">{product.name}</h1>
        <p className="mt-4 text-cocoa">{product.description}</p>
        <div className="mt-5 flex items-end gap-3">
          <p className="text-3xl font-bold text-orange-600">{formatEUR(selectedVariant.price)}</p>
          <p className="text-sm text-cocoa line-through">{formatEUR(selectedVariant.price * 1.22)}</p>
          <span className="rounded border border-orange-500 px-2 py-0.5 text-xs font-bold text-orange-600">18% OFF</span>
        </div>
        <p className="mt-2 text-sm text-cocoa">{product.soldCount} sold · {product.rating?.toFixed(1)} ★★★★★</p>

        <div className="mt-7 space-y-6">
          <div>
            <label className="text-sm font-semibold text-ink">Variant</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setVariantId(variant.id)}
                  className={`min-w-20 rounded-full border px-3 py-2 text-center text-sm sm:px-4 ${variantId === variant.id ? "border-champagne bg-champagne text-ink" : "border-black/20"}`}
                >
                  <span className="block font-semibold">{variant.name}</span>
                  <span className="text-cocoa">{formatEUR(variant.price)}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="engraving" className="text-sm font-semibold text-ink">
              {product.personalization.label}
            </label>
            <input
              id="engraving"
              value={engravingText}
              onChange={(event) => setEngravingText(event.target.value.slice(0, product.personalization.maxLength))}
              placeholder="Example: Chau, Luna, C.P."
              className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3"
            />
            <p className="mt-2 text-xs text-cocoa">
              Placement: {product.personalization.placement}. Maximum {product.personalization.maxLength} characters.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-ink">
              Font
              <select value={font} onChange={(event) => setFont(event.target.value)} className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3">
                {product.personalization.fonts.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-ink">
              Color
              <select value={color} onChange={(event) => setColor(event.target.value)} className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3">
                {product.personalization.colors.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm font-semibold text-ink">
            Quantity
            <select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="focus-ring mt-2 w-28 rounded-md border border-black/15 px-4 py-3">
              {[1, 2, 3, 4, 5].map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>

          <Button onClick={generatePreview} variant="gold" disabled={!engravingText || loadingPreview} className="w-full">
            {loadingPreview ? "Generating preview..." : "AI preview maken"} <FiImage />
          </Button>

          <div className="rounded-lg bg-linen p-4 text-sm leading-6 text-cocoa">
            <p className="font-semibold text-ink">Delivery estimate: {product.deliveryDays}</p>
            <p>Confirm the name and preview carefully before placing the order.</p>
          </div>

          {out ? (
            <Button disabled className="w-full bg-cocoa/40">Out of stock</Button>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={addToCart} disabled={!engravingText} className="w-full">
                {t("addToCart")} <FiShoppingBag />
              </Button>
              <LinkButton href="/checkout" variant="secondary" className="w-full" onClick={addToCart}>
                {t("buyNow")} <FiZap />
              </LinkButton>
            </div>
          )}
          {added ? (
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <FiCheck /> Added to cart.
            </p>
          ) : null}
          <div className="grid gap-3 border-t border-black/10 pt-5 text-sm text-cocoa">
            <p className="flex items-center gap-2 font-semibold text-green-700"><FiTruck /> Free shipping on all orders</p>
            <p className="flex items-center gap-2 font-semibold text-ink"><FiShield /> Safe payments · COD or PayPal at checkout</p>
            <p className="flex items-center gap-2 font-semibold text-ink"><FiCheck /> Order guarantee · Preview before production</p>
          </div>
        </div>
      </div>
    </div>
  );
}
