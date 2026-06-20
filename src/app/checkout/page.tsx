"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { cartTotal, clearCart, readCart } from "@/lib/cart";
import { calculateCheckoutTotals, countryOptions, type CustomerType, type ShippingCountry } from "@/lib/checkout-rules";
import { formatEUR } from "@/lib/money";
import type { CartItem } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState<ShippingCountry>("NL");
  const [customerType, setCustomerType] = useState<CustomerType>("private");
  const [vatNumber, setVatNumber] = useState("");

  useEffect(() => setItems(readCart()), []);

  const subtotal = cartTotal(items);
  const totals = calculateCheckoutTotals({ subtotalGross: subtotal, country, customerType, vatNumber });

  async function submit(formData: FormData) {
    const requestedTotals = calculateCheckoutTotals({
      subtotalGross: cartTotal(items),
      country: formData.get("country") as ShippingCountry,
      customerType: formData.get("customerType") as CustomerType,
      vatNumber: String(formData.get("vatNumber") || "")
    });
    if (!requestedTotals.vatValid) {
      alert("Please enter a valid EU VAT number before applying business VAT exemption.");
      return;
    }
    setLoading(true);
    const payload = {
      customer: {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        country: formData.get("country"),
        customerType: formData.get("customerType"),
        vatNumber: requestedTotals.vatNumber,
        newsletterOptIn: formData.get("newsletterOptIn") === "on"
      },
      paymentMethod: formData.get("paymentMethod"),
      items,
      subtotal: requestedTotals.subtotalGross,
      shippingAmount: requestedTotals.shippingGross,
      vatAmount: requestedTotals.vatAmount,
      vatExempt: requestedTotals.vatExempt,
      total: requestedTotals.total
    };
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = (await response.json()) as { orderId?: string; approvalUrl?: string; error?: string; details?: string };
    if (!response.ok || !data.orderId) {
      alert(`${data.error || "Could not create order."}${data.details ? `\n${data.details}` : ""}`);
      setLoading(false);
      return;
    }
    if (data.approvalUrl) {
      window.location.href = data.approvalUrl;
      return;
    }
    clearCart();
    router.push(`/orders?created=${data.orderId}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-700">Secure checkout</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">Confirm your personalized order</h1>
      {search.get("paypal") === "cancelled" ? (
        <div className="mt-5 rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm font-semibold text-orange-900">
          PayPal payment was cancelled. Your cart is still here, so you can try again or choose another payment method.
        </div>
      ) : null}
      {search.get("mollie") === "cancelled" ? (
        <div className="mt-5 rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm font-semibold text-orange-900">
          Mollie payment was not completed. Your cart is still here, so you can try again or choose another payment method.
        </div>
      ) : null}
      <div className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6">
        <form action={submit} className="rounded-lg border border-orange-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-ink">Full name<input name="name" required className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
            <label className="text-sm font-semibold text-ink">Email<input name="email" type="email" required className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
            <label className="text-sm font-semibold text-ink">Phone<input name="phone" required className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
            <label className="text-sm font-semibold text-ink">
              Country
              <select name="country" value={country} onChange={(event) => setCountry(event.target.value as ShippingCountry)} className="focus-ring mt-2 w-full rounded-md border border-black/15 bg-white px-4 py-3">
                {countryOptions.map((option) => <option key={option.code} value={option.code}>{option.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold text-ink">
              Customer type
              <select name="customerType" value={customerType} onChange={(event) => setCustomerType(event.target.value as CustomerType)} className="focus-ring mt-2 w-full rounded-md border border-black/15 bg-white px-4 py-3">
                <option value="private">Private customer</option>
                <option value="business">Business customer</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-ink">
              VAT number {customerType === "business" ? "" : "(optional)"}
              <input
                name="vatNumber"
                value={vatNumber}
                onChange={(event) => setVatNumber(event.target.value)}
                placeholder="NL123456789B01"
                className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3 uppercase"
              />
              {customerType === "business" && vatNumber && !totals.vatValid ? <span className="mt-1 block text-xs text-red-600">Enter a valid EU VAT number.</span> : null}
              {customerType === "business" && totals.vatExempt ? <span className="mt-1 block text-xs font-semibold text-green-700">EU reverse charge applied. No VAT charged.</span> : null}
            </label>
            <label className="text-sm font-semibold text-ink sm:col-span-2">Delivery address<textarea name="address" required rows={4} className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
          </div>
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-orange-100 bg-orange-50 p-4 text-sm text-cocoa">
            <input type="checkbox" name="newsletterOptIn" className="mt-1" />
            <span>Yes, I'd like to receive news & special offers. / Ja, ik ontvang graag nieuws & speciale aanbiedingen.</span>
          </label>
          <fieldset className="mt-6 rounded-lg border border-orange-200 bg-linen p-4">
            <legend className="px-2 text-sm font-semibold text-ink">Payment method / Betaalmethode</legend>
            <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-md bg-white p-3 ring-1 ring-orange-100">
              <input type="radio" name="paymentMethod" value="cod" defaultChecked />
              <span><b>COD</b> - Cash on delivery / Betalen bij levering</span>
            </label>
            <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-md bg-white p-3 ring-1 ring-orange-100">
              <input type="radio" name="paymentMethod" value="paypal" />
              <span><b>PayPal</b> - Pay now securely with PayPal</span>
            </label>
            <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-md bg-white p-3 ring-1 ring-orange-100">
              <input type="radio" name="paymentMethod" value="mollie" />
              <span><b>Mollie</b> - iDEAL, cards and European payment methods</span>
            </label>
          </fieldset>
          <Button disabled={loading || items.length === 0} className="mt-6 w-full">
            {loading ? "Creating order..." : "Confirm order"}
          </Button>
        </form>
        <aside className="h-fit min-w-0 rounded-lg bg-ink p-5 text-white lg:sticky lg:top-28">
          <p className="font-semibold">Review</p>
          <div className="mt-4 space-y-3">
            {items.map((item, index) => (
              <div key={`${item.product.id}-${index}`} className="border-b border-white/10 pb-3 text-sm">
                <p className="break-words font-semibold">{item.product.name}</p>
                <p className="break-words text-white/70">Engraving: {item.engravingText}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm">
            <div className="flex justify-between gap-4"><span className="text-white/70">Subtotal</span><span className="shrink-0">{formatEUR(totals.subtotalGross)}</span></div>
            <div className="flex justify-between gap-4"><span className="text-white/70">Shipping</span><span className="shrink-0">{totals.shippingGross === 0 ? "Free" : formatEUR(totals.shippingGross)}</span></div>
            <div className="flex justify-between gap-4"><span className="text-white/70">VAT 21%</span><span className="shrink-0">{totals.vatExempt ? "Reverse charge" : formatEUR(totals.vatAmount)}</span></div>
            <p className="rounded-md bg-white/10 p-3 text-xs text-white/70">
              Free shipping from {formatEUR(totals.shippingRule.threshold)} for {totals.shippingRule.label}.
            </p>
          </div>
          <div className="mt-5 flex justify-between gap-4 border-t border-white/10 pt-5 text-lg font-bold">
            <span>Total</span>
            <span className="shrink-0">{formatEUR(totals.total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
