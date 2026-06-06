"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Button, LinkButton } from "@/components/button";
import { cartTotal, readCart, writeCart } from "@/lib/cart";
import { formatEUR } from "@/lib/money";
import type { CartItem } from "@/types";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => setItems(readCart()), []);

  function remove(index: number) {
    const next = items.filter((_, itemIndex) => itemIndex !== index);
    setItems(next);
    writeCart(next);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-700">Personalized bag</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">Your custom bag</h1>
      {items.length === 0 ? (
        <div className="mt-8 rounded-lg bg-white p-8 text-center">
          <p className="text-cocoa">Your cart is empty.</p>
          <LinkButton href="/shop" className="mt-5">Start customizing</LinkButton>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item, index) => {
              const variant = item.product.variants.find((candidate) => candidate.id === item.variantId);
              return (
                <div key={`${item.product.id}-${index}`} className="grid gap-4 rounded-lg border border-orange-100 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr_auto]">
                  <div className="relative aspect-square overflow-hidden rounded-md bg-linen">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-ink">{item.product.name}</h2>
                    <p className="mt-1 text-sm text-cocoa">{variant?.name} · Qty {item.quantity}</p>
                    <p className="mt-3 text-sm text-cocoa">Text: <b>{item.engravingText}</b></p>
                    <p className="text-sm text-cocoa">Font: {item.font} · Color: {item.color}</p>
                  </div>
                  <div className="flex items-start justify-between gap-4 sm:block sm:text-right">
                    <p className="font-bold">{formatEUR((variant?.price || item.product.basePrice) * item.quantity)}</p>
                    <Button variant="ghost" className="mt-2 px-2" onClick={() => remove(index)} aria-label="Remove item">
                      <FiTrash2 />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <aside className="h-fit rounded-lg border border-orange-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-wide text-cocoa">Order summary</p>
            <div className="mt-5 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatEUR(cartTotal(items))}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-cocoa">You will confirm personalization details before production.</p>
            <LinkButton href="/checkout" className="mt-5 w-full">Continue to checkout</LinkButton>
          </aside>
        </div>
      )}
    </div>
  );
}
