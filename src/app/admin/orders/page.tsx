"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiCheck,
  FiChevronRight,
  FiClock,
  FiCreditCard,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiTruck,
  FiUser,
  FiX
} from "react-icons/fi";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/button";
import { T } from "@/components/t";
import { formatEUR } from "@/lib/money";

type OrderItem = {
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

type Order = {
  id: string;
  customer: string;
  email: string;
  phone?: string | null;
  total: number;
  status: string;
  paymentMethod: string;
  trackingNumber?: string | null;
  address: string;
  createdAt?: string;
  items: OrderItem[];
};

const statuses = [
  { value: "pending", label: "Pending", helper: "Order received" },
  { value: "confirmed", label: "Confirmed", helper: "Payment/order checked" },
  { value: "waiting_for_shipping", label: "Ready to ship", helper: "Packed for courier" },
  { value: "shipping", label: "Shipping", helper: "Courier in progress" },
  { value: "delivered", label: "Delivered", helper: "Completed" },
  { value: "cancelled", label: "Cancelled", helper: "Stopped" }
];

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900 ring-amber-200",
  confirmed: "bg-blue-100 text-blue-900 ring-blue-200",
  waiting_for_shipping: "bg-purple-100 text-purple-900 ring-purple-200",
  shipping: "bg-sky-100 text-sky-900 ring-sky-200",
  delivered: "bg-emerald-100 text-emerald-900 ring-emerald-200",
  cancelled: "bg-rose-100 text-rose-900 ring-rose-200",
  in_production: "bg-champagne/70 text-ink ring-champagne",
  shipped: "bg-sky-100 text-sky-900 ring-sky-200"
};

function statusLabel(status: string) {
  return statuses.find((item) => item.value === status)?.label || status.replaceAll("_", " ");
}

function formatDate(value?: string) {
  if (!value) return "New order";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const visibleOrders = orders.slice((page - 1) * pageSize, page * pageSize);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/orders");
    const data = await response.json();
    setOrders(data.orders || []);
    setPage(1);
    setLoading(false);
  }

  async function updateStatus(order: Order, status: string) {
    if (status === "shipping" && !trackingNumber.trim()) {
      alert("Please enter the tracking number before moving this order to Shipping.");
      return;
    }
    setSavingStatus(true);
    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status, trackingNumber: trackingNumber.trim() })
    });
    if (response.ok) {
      const nextOrder = { ...order, status, trackingNumber: status === "shipping" ? trackingNumber.trim() : order.trackingNumber };
      setSelected(nextOrder);
      setOrders((current) => current.map((item) => (item.id === order.id ? nextOrder : item)));
    }
    setSavingStatus(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setTrackingNumber(selected?.trackingNumber || "");
  }, [selected?.id, selected?.trackingNumber]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    return [
      { label: "Orders", value: orders.length.toString(), icon: FiPackage },
      { label: "Revenue", value: formatEUR(revenue), icon: FiCreditCard },
      { label: "Pending", value: orders.filter((order) => order.status === "pending").length.toString(), icon: FiClock },
      { label: "Shipping", value: orders.filter((order) => ["waiting_for_shipping", "shipping", "shipped"].includes(order.status)).length.toString(), icon: FiTruck }
    ];
  }, [orders]);

  return (
    <AdminShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cocoa">Fulfilment studio</p>
            <h1 className="mt-2 text-4xl font-semibold text-ink"><T k="orderManagement" /></h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-cocoa">
              Review every personalized item, customer detail, payment method and delivery status in one working view.
            </p>
          </div>
          <Button onClick={load} variant="secondary">Refresh orders</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-cocoa">{label}</p>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-linen text-ink"><Icon /></span>
              </div>
              <p className="mt-4 text-3xl font-semibold text-ink">{value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-lg border border-black/10 bg-white shadow-sm">
          <div className="min-w-[920px]">
          <div className="grid grid-cols-[1.1fr_1fr_0.75fr_0.7fr_0.85fr_0.8fr] bg-ink px-5 py-4 text-sm font-semibold text-white">
            <span>Order</span>
            <span><T k="customer" /></span>
            <span>Total</span>
            <span>Payment</span>
            <span><T k="status" /></span>
            <span>Action</span>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-md bg-linen" />
              ))}
            </div>
          ) : null}

          {!loading && orders.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-lg font-semibold text-ink">No orders yet</p>
              <p className="mt-2 text-sm text-cocoa">New checkout orders will appear here after Supabase insert succeeds.</p>
            </div>
          ) : null}

          {!loading && visibleOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelected(order)}
              className="grid w-full grid-cols-[1.1fr_1fr_0.75fr_0.7fr_0.85fr_0.8fr] items-center border-t border-black/10 px-5 py-5 text-left text-sm transition hover:bg-linen/70"
            >
              <span>
                <b className="block text-ink">{order.id}</b>
                <small className="mt-1 block text-cocoa">{formatDate(order.createdAt)}</small>
              </span>
              <span>
                <b className="block font-semibold text-ink">{order.customer}</b>
                <small className="mt-1 block max-w-[220px] truncate text-cocoa">{order.email}</small>
              </span>
              <span className="font-semibold text-ink">{formatEUR(order.total)}</span>
              <span className="uppercase text-cocoa">{order.paymentMethod}</span>
              <span>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusStyles[order.status] || "bg-linen text-ink ring-black/10"}`}>
                  {statusLabel(order.status)}
                </span>
              </span>
              <span className="inline-flex items-center gap-2 font-semibold text-ink">
                View detail <FiChevronRight />
              </span>
            </button>
          ))}
          </div>
        </div>
        {totalPages > 1 ? (
          <div className="flex justify-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-full bg-linen px-4 py-2 text-sm font-semibold disabled:opacity-40">Previous</button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button key={index} onClick={() => setPage(index + 1)} className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold ${page === index + 1 ? "bg-ink text-white" : "bg-linen text-ink"}`}>
                {index + 1}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded-full bg-linen px-4 py-2 text-sm font-semibold disabled:opacity-40">Next</button>
          </div>
        ) : null}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[100] bg-black/50 p-4 backdrop-blur-sm">
          <div className="mx-auto grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-soft lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="overflow-y-auto p-6 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-cocoa">Order detail</p>
                  <h2 className="mt-2 text-4xl font-semibold text-ink">{selected.id}</h2>
                  <p className="mt-2 text-sm text-cocoa">{formatDate(selected.createdAt)}</p>
                </div>
                <button className="grid h-11 w-11 place-items-center rounded-full border border-black/10 hover:bg-linen lg:hidden" onClick={() => setSelected(null)} aria-label="Close">
                  <FiX />
                </button>
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-linen p-4">
                  <FiUser className="text-xl text-cocoa" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-cocoa">Customer</p>
                  <p className="mt-1 font-semibold text-ink">{selected.customer}</p>
                  <p className="mt-1 text-sm text-cocoa">{selected.email}</p>
                </div>
                <div className="rounded-lg bg-linen p-4">
                  <FiMapPin className="text-xl text-cocoa" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-cocoa">Shipping address</p>
                  <p className="mt-1 font-semibold text-ink">{selected.address}</p>
                  <p className="mt-1 text-sm text-cocoa">{selected.phone || "No phone provided"}</p>
                </div>
                <div className="rounded-lg bg-linen p-4">
                  <FiCreditCard className="text-xl text-cocoa" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-cocoa">Payment</p>
                  <p className="mt-1 font-semibold uppercase text-ink">{selected.paymentMethod}</p>
                  <p className="mt-1 text-sm text-cocoa">{formatEUR(selected.total)} total</p>
                  {selected.trackingNumber ? <p className="mt-2 text-sm font-semibold text-ink">Tracking: {selected.trackingNumber}</p> : null}
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-ink">Personalized items</h3>
                  <span className="text-sm font-semibold text-cocoa">{selected.items.length} item(s)</span>
                </div>
                <div className="mt-4 space-y-4">
                  {selected.items.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="grid gap-4 rounded-lg border border-black/10 p-4 md:grid-cols-[120px_minmax(0,1fr)_140px]">
                      <div className="aspect-square overflow-hidden rounded-md bg-linen">
                        {item.previewUrl || item.image ? (
                          <img src={item.previewUrl || item.image || ""} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full place-items-center text-2xl text-cocoa"><FiPackage /></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg font-semibold text-ink">{item.name}</p>
                        <div className="mt-3 grid gap-2 text-sm text-cocoa sm:grid-cols-2">
                          <p><b className="text-ink">Variant:</b> {item.variant || "Standard"}</p>
                          <p><b className="text-ink">Quantity:</b> {item.quantity}</p>
                          <p><b className="text-ink">Engraving:</b> {item.engravingText || "None"}</p>
                          <p><b className="text-ink">Font:</b> {item.engravingFont || "Default"}</p>
                          <p><b className="text-ink">Color:</b> {item.engravingColor || "Default"}</p>
                        </div>
                      </div>
                      <div className="rounded-md bg-linen p-4 text-right">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-cocoa">Unit price</p>
                        <p className="mt-2 text-xl font-semibold text-ink">{formatEUR(item.unitPrice)}</p>
                        <p className="mt-2 text-sm text-cocoa">Line: {formatEUR(item.unitPrice * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="border-t border-black/10 bg-linen p-6 lg:border-l lg:border-t-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cocoa">Current status</p>
                  <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusStyles[selected.status] || "bg-white text-ink ring-black/10"}`}>
                    {statusLabel(selected.status)}
                  </span>
                </div>
                <button className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white hover:bg-champagne/40" onClick={() => setSelected(null)} aria-label="Close">
                  <FiX />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {statuses.map((status, index) => {
                  const activeIndex = statuses.findIndex((item) => item.value === selected.status);
                  const isDone = activeIndex >= index && selected.status !== "cancelled";
                  const isActive = selected.status === status.value;
                  return (
                    <button
                      key={status.value}
                      onClick={() => updateStatus(selected, status.value)}
                      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                        isActive ? "border-ink bg-white shadow-sm" : "border-black/10 bg-white/70 hover:bg-white"
                      }`}
                    >
                      <span className={`grid h-9 w-9 place-items-center rounded-full ${isDone || isActive ? "bg-ink text-white" : "bg-linen text-cocoa"}`}>
                        {isDone ? <FiCheck /> : <FiClock />}
                      </span>
                      <span>
                        <b className="block text-sm text-ink">{status.label}</b>
                        <small className="text-cocoa">{status.helper}</small>
                      </span>
                    </button>
                  );
                })}
              </div>

              <label className="mt-5 block rounded-lg border border-black/10 bg-white p-4 text-sm font-semibold text-ink">
                Tracking number for shipping
                <input
                  value={trackingNumber || selected.trackingNumber || ""}
                  onChange={(event) => setTrackingNumber(event.target.value)}
                  placeholder="Enter courier tracking number"
                  className="focus-ring mt-3 w-full rounded-md border border-black/15 px-4 py-3 font-normal"
                />
                <span className="mt-2 block text-xs font-normal leading-5 text-cocoa">
                  Required when changing status to Shipping. The customer email will include this tracking number.
                </span>
              </label>

              {savingStatus ? <p className="mt-4 text-sm font-semibold text-cocoa">Saving status...</p> : null}

              <div className="mt-6 rounded-lg bg-white p-4">
                <p className="text-sm font-semibold text-ink">Fulfilment note</p>
                <p className="mt-2 text-sm leading-6 text-cocoa">
                  Check engraving text, preview image and shipping information before moving the order to courier status.
                </p>
              </div>
              <a href={`tel:${selected.phone || ""}`} className="mt-4 flex items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-ink hover:bg-champagne/40">
                <FiPhone /> Contact customer
              </a>
            </aside>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
