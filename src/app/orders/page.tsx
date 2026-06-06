"use client";

import { useEffect, useState } from "react";
import { FiBox, FiCalendar, FiCreditCard, FiMapPin, FiPackage, FiX } from "react-icons/fi";
import { LinkButton } from "@/components/button";
import { formatEUR } from "@/lib/money";

type TrackingItem = {
  name: string;
  variant?: string | null;
  engravingText?: string | null;
  engravingFont?: string | null;
  engravingColor?: string | null;
  quantity: number;
  unitPrice: number;
  image?: string | null;
  previewUrl?: string | null;
};

type TrackingOrder = {
  id: string;
  status: string;
  trackingNumber?: string | null;
  item?: string;
  updatedAt?: string;
  total?: number;
  paymentMethod?: string;
  address?: string;
  items?: TrackingItem[];
};

const pageSize = 5;

export default function OrdersPage() {
  const [orders, setOrders] = useState<TrackingOrder[]>([]);
  const [selected, setSelected] = useState<TrackingOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const visibleOrders = orders.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    fetch("/api/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-cocoa">Deluna orders</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">Order tracking</h1>
          <p className="mt-3 max-w-2xl text-cocoa">
            Review order status, personalization details, payment method and product items.
          </p>
        </div>
        <p className="text-sm font-semibold text-cocoa">{orders.length} order(s)</p>
      </div>

      <div className="mt-8 grid gap-4">
        {loading ? Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-lg border border-black/10 bg-white" />
        )) : null}

        {!loading && visibleOrders.map((order) => (
          <button key={order.id} onClick={() => setSelected(order)} className="grid gap-4 rounded-lg border border-black/10 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-soft md:grid-cols-[auto_1fr_auto] md:items-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-linen text-ink"><FiPackage /></span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-semibold text-ink">{order.id}</p>
                <span className="rounded-full bg-champagne px-3 py-1 text-xs font-bold capitalize text-ink">{order.status?.replaceAll("_", " ")}</span>
              </div>
              <p className="mt-2 text-sm text-cocoa">{order.item || "Custom Deluna order"}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-cocoa">
                <span className="inline-flex items-center gap-1"><FiCalendar /> {order.updatedAt ? new Date(order.updatedAt).toLocaleDateString("en-GB") : "New"}</span>
                <span className="inline-flex items-center gap-1"><FiCreditCard /> {order.paymentMethod?.toUpperCase() || "COD"}</span>
                {order.trackingNumber ? <span>Tracking: {order.trackingNumber}</span> : null}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-ink">{formatEUR(Number(order.total || 0))}</p>
              <p className="mt-1 text-sm text-cocoa">View detail</p>
            </div>
          </button>
        ))}

        {!loading && orders.length === 0 ? (
          <div className="rounded-lg border border-orange-200 bg-white p-8 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-linen text-ink"><FiPackage /></span>
            <h2 className="mt-4 text-2xl font-semibold text-ink">No account orders yet</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-cocoa">
              Order history is only saved for customers who are logged in during checkout. Guest checkout orders are still confirmed by email, but they will not appear here.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <LinkButton href="/login" variant="secondary">Log in</LinkButton>
              <LinkButton href="/shop">Shop personalized items</LinkButton>
            </div>
          </div>
        ) : null}
      </div>

      {totalPages > 1 ? (
        <div className="mt-8 flex justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-full bg-linen px-4 py-2 text-sm font-semibold disabled:opacity-40">Previous</button>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button key={index} onClick={() => setPage(index + 1)} className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold ${page === index + 1 ? "bg-ink text-white" : "bg-linen text-ink"}`}>
              {index + 1}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded-full bg-linen px-4 py-2 text-sm font-semibold disabled:opacity-40">Next</button>
        </div>
      ) : null}

      {selected ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-soft">
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-black/10 bg-white p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cocoa">Order detail</p>
                <h2 className="mt-2 text-3xl font-semibold text-ink">{selected.id}</h2>
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-black/10 hover:bg-linen" onClick={() => setSelected(null)}><FiX /></button>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-3">
              <div className="rounded-lg bg-linen p-4"><FiBox /><p className="mt-3 text-sm font-semibold">Status</p><p className="capitalize text-cocoa">{selected.status?.replaceAll("_", " ")}</p></div>
              <div className="rounded-lg bg-linen p-4"><FiCreditCard /><p className="mt-3 text-sm font-semibold">Payment</p><p className="uppercase text-cocoa">{selected.paymentMethod || "COD"}</p></div>
              <div className="rounded-lg bg-linen p-4"><FiMapPin /><p className="mt-3 text-sm font-semibold">Address</p><p className="text-cocoa">{selected.address || "No address saved"}</p></div>
            </div>
            {selected.trackingNumber ? (
              <div className="mx-6 mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-900">
                Shipping tracking number: {selected.trackingNumber}
              </div>
            ) : null}
            <div className="px-6 pb-6">
              <h3 className="text-xl font-semibold text-ink">Items</h3>
              <div className="mt-4 space-y-3">
                {(selected.items || []).map((item, index) => (
                  <div key={`${item.name}-${index}`} className="grid gap-4 rounded-lg border border-black/10 p-4 md:grid-cols-[96px_1fr_auto]">
                    <div className="aspect-square overflow-hidden rounded-md bg-linen">
                      {item.previewUrl || item.image ? <img src={item.previewUrl || item.image || ""} alt={item.name} className="h-full w-full object-cover" /> : null}
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{item.name}</p>
                      <p className="mt-2 text-sm text-cocoa">Variant: {item.variant || "Standard"} · Qty: {item.quantity}</p>
                      <p className="mt-1 text-sm text-cocoa">Engraving: {item.engravingText || "None"} · {item.engravingFont || "Default"} · {item.engravingColor || "Default"}</p>
                    </div>
                    <p className="font-semibold text-ink">{formatEUR(item.unitPrice * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
