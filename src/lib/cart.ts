"use client";

import type { CartItem } from "@/types";

const key = "deluna_cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event("deluna-cart"));
}

export function clearCart() {
  writeCart([]);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((total, item) => {
    const variant = item.product.variants.find((candidate) => candidate.id === item.variantId);
    return total + (variant?.price || item.product.basePrice) * item.quantity;
  }, 0);
}
