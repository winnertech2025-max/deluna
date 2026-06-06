"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCheckCircle, FiLoader, FiXCircle } from "react-icons/fi";
import { LinkButton } from "@/components/button";
import { clearCart } from "@/lib/cart";

export default function PayPalCompletePage() {
  const router = useRouter();
  const search = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Confirming your PayPal payment...");

  useEffect(() => {
    const token = search.get("token");
    const orderNumber = search.get("order");

    if (!token || !orderNumber) {
      setStatus("error");
      setMessage("Missing PayPal payment information.");
      return;
    }

    fetch("/api/paypal/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, orderNumber })
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.details || data.error || "Payment could not be captured.");
        clearCart();
        setStatus("success");
        setMessage("Payment confirmed. Your Deluna order is now confirmed.");
        setTimeout(() => router.push(`/orders?created=${data.orderId}&payment=paid`), 1200);
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Payment could not be completed.");
      });
  }, [router, search]);

  return (
    <main className="grid min-h-[60vh] place-items-center bg-linen px-4 py-16">
      <section className="w-full max-w-lg rounded-lg border border-orange-200 bg-white p-8 text-center shadow-soft">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-orange-50 text-3xl text-orange-700">
          {status === "loading" ? <FiLoader className="animate-spin" /> : status === "success" ? <FiCheckCircle /> : <FiXCircle />}
        </div>
        <h1 className="mt-5 text-3xl font-semibold text-ink">
          {status === "loading" ? "Processing payment" : status === "success" ? "Payment confirmed" : "Payment issue"}
        </h1>
        <p className="mt-3 leading-7 text-cocoa">{message}</p>
        {status === "error" ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <LinkButton href="/checkout">Back to checkout</LinkButton>
            <LinkButton href="/contact" variant="secondary">Contact support</LinkButton>
          </div>
        ) : null}
      </section>
    </main>
  );
}
