"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { cartTotal, clearCart, readCart } from "@/lib/cart";
import { formatEUR } from "@/lib/money";
import type { CartItem } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => setItems(readCart()), []);

  async function submit(formData: FormData) {
    setLoading(true);
    const payload = {
      customer: {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address")
      },
      paymentMethod: formData.get("paymentMethod"),
      items,
      total: cartTotal(items)
    };
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = (await response.json()) as { orderId?: string; error?: string; details?: string };
    if (!response.ok || !data.orderId) {
      alert(`${data.error || "Could not create order."}${data.details ? `\n${data.details}` : ""}`);
      setLoading(false);
      return;
    }
    clearCart();
    router.push(`/orders?created=${data.orderId}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-700">Secure checkout</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">Confirm your personalized order</h1>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px] lg:gap-6">
        <form action={submit} className="rounded-lg border border-orange-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-ink">Full name<input name="name" required className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
            <label className="text-sm font-semibold text-ink">Email<input name="email" type="email" required className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
            <label className="text-sm font-semibold text-ink">Phone<input name="phone" required className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
            <label className="text-sm font-semibold text-ink sm:col-span-2">Delivery address<textarea name="address" required rows={4} className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
          </div>
          <fieldset className="mt-6 rounded-lg border border-orange-200 bg-linen p-4">
            <legend className="px-2 text-sm font-semibold text-ink">Payment method / Betaalmethode</legend>
            <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-md bg-white p-3 ring-1 ring-orange-100">
              <input type="radio" name="paymentMethod" value="cod" defaultChecked />
              <span><b>COD</b> - Cash on delivery / Betalen bij levering</span>
            </label>
            <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-md bg-white p-3 ring-1 ring-orange-100">
              <input type="radio" name="paymentMethod" value="paypal" />
              <span><b>PayPal</b> - Pay securely with PayPal</span>
            </label>
          </fieldset>
          <Button disabled={loading || items.length === 0} className="mt-6 w-full">
            {loading ? "Creating order..." : "Confirm order"}
          </Button>
        </form>
        <aside className="h-fit rounded-lg bg-ink p-5 text-white lg:sticky lg:top-28">
          <p className="font-semibold">Review</p>
          <div className="mt-4 space-y-3">
            {items.map((item, index) => (
              <div key={`${item.product.id}-${index}`} className="border-b border-white/10 pb-3 text-sm">
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-white/70">Engraving: {item.engravingText}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t border-white/10 pt-5 text-lg font-bold">
            <span>Total</span>
            <span>{formatEUR(cartTotal(items))}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
