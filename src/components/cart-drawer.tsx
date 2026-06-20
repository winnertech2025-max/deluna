"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiMinus, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { Button } from "@/components/button";
import { cartTotal, writeCart } from "@/lib/cart";
import { formatEUR } from "@/lib/money";
import type { CartItem } from "@/types";

type CartDrawerProps = {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onItemsChange: (items: CartItem[]) => void;
};

export function CartDrawer({ open, items, onClose, onItemsChange }: CartDrawerProps) {
  function updateItems(nextItems: CartItem[]) {
    writeCart(nextItems);
    onItemsChange(nextItems);
  }

  function changeQuantity(index: number, direction: -1 | 1) {
    const next = items
      .map((item, itemIndex) => (itemIndex === index ? { ...item, quantity: Math.max(1, item.quantity + direction) } : item))
      .filter((item) => item.quantity > 0);
    updateItems(next);
  }

  function remove(index: number) {
    updateItems(items.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <button className={`absolute inset-0 bg-black/45 transition ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} aria-label="Close cart" />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-white shadow-2xl transition duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">Deluna bag</p>
            <h2 className="mt-1 text-2xl font-black text-ink">Your custom items</h2>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-black/10 hover:bg-orange-50" aria-label="Close cart">
            <FiX />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-orange-50 text-orange-600">
              <FiTrash2 size={24} />
            </div>
            <h3 className="mt-5 text-xl font-black text-ink">Your bag is empty</h3>
            <p className="mt-3 text-sm leading-6 text-cocoa">Start with a product, add a name, and your personalized item will appear here.</p>
            <Link href="/shop" onClick={onClose} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700">
              Start shopping <FiArrowRight />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {items.map((item, index) => {
                const variant = item.product.variants.find((candidate) => candidate.id === item.variantId);
                const price = (variant?.price || item.product.basePrice) * item.quantity;
                return (
                  <div key={`${item.product.id}-${index}`} className="grid grid-cols-[76px_minmax(0,1fr)] gap-3 rounded-lg border border-orange-100 bg-[#fff8f0] p-3 sm:grid-cols-[92px_minmax(0,1fr)] sm:gap-4">
                    <div className="relative aspect-square overflow-hidden rounded-md bg-white">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="min-w-0 line-clamp-2 text-sm font-black leading-5 text-ink">{item.product.name}</h3>
                        <button onClick={() => remove(index)} className="text-cocoa hover:text-red-600" aria-label="Remove item">
                          <FiTrash2 />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-cocoa">{variant?.name || "Standard"} · {item.color}</p>
                      <p className="mt-2 text-xs text-cocoa">Text: <b className="text-ink">{item.engravingText}</b></p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center overflow-hidden rounded-full border border-black/10 bg-white">
                          <button onClick={() => changeQuantity(index, -1)} className="grid h-8 w-8 place-items-center hover:bg-orange-50" aria-label="Decrease quantity"><FiMinus size={14} /></button>
                          <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => changeQuantity(index, 1)} className="grid h-8 w-8 place-items-center hover:bg-orange-50" aria-label="Increase quantity"><FiPlus size={14} /></button>
                        </div>
                        <p className="font-black text-ink">{formatEUR(price)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-black/10 bg-white p-5">
              <div className="flex items-center justify-between text-lg font-black">
                <span>Total</span>
                <span>{formatEUR(cartTotal(items))}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-cocoa">Shipping, VAT and payment method are confirmed at checkout.</p>
              <Link href="/checkout" onClick={onClose} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-orange-700">
                Checkout <FiArrowRight />
              </Link>
              <Button variant="ghost" onClick={onClose} className="mt-2 w-full">Continue shopping</Button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
