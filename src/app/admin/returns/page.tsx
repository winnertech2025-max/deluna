"use client";

import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/button";
import { formatEUR } from "@/lib/money";

type ReturnOrder = {
  id: string;
  order_number: string;
  customer_email: string;
  reason: string;
  condition: string;
  status: string;
  refund_amount: number;
  notes: string | null;
  created_at: string;
};

const statuses = ["received", "inspecting", "refund_pending", "refunded", "rejected"];

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnOrder[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/returns");
    const data = await response.json();
    setReturns(data.returns || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cocoa">After-sales</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">Returned goods</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-cocoa">Track returned orders, condition checks, refund amount and resolution status.</p>
        </div>
      </div>

      <form
        className="mt-8 grid gap-3 rounded-lg border border-black/10 bg-white p-5 lg:grid-cols-[1fr_1fr_1fr_1fr_140px_auto]"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          await fetch("/api/admin/returns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderNumber: form.get("orderNumber"),
              customerEmail: form.get("customerEmail"),
              reason: form.get("reason"),
              condition: form.get("condition"),
              refundAmount: form.get("refundAmount"),
              notes: form.get("notes")
            })
          });
          event.currentTarget.reset();
          load();
        }}
      >
        <input name="orderNumber" required placeholder="Order number" className="focus-ring rounded-md border border-black/15 px-4 py-3" />
        <input name="customerEmail" required type="email" placeholder="Customer email" className="focus-ring rounded-md border border-black/15 px-4 py-3" />
        <input name="reason" required placeholder="Return reason" className="focus-ring rounded-md border border-black/15 px-4 py-3" />
        <input name="condition" required placeholder="Item condition" className="focus-ring rounded-md border border-black/15 px-4 py-3" />
        <input name="refundAmount" type="number" step="0.01" placeholder="Refund" className="focus-ring rounded-md border border-black/15 px-4 py-3" />
        <Button>Create</Button>
      </form>

      <div className="mt-8 grid gap-4">
        {loading ? Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-28 animate-pulse rounded-lg bg-white" />) : null}
        {!loading && returns.length === 0 ? (
          <div className="rounded-lg border border-black/10 bg-white p-8 text-center text-cocoa">No returned goods yet.</div>
        ) : null}
        {!loading && returns.map((item) => (
          <div key={item.id} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-linen"><FiRefreshCw /></span>
                  <div>
                    <p className="font-semibold text-ink">{item.order_number}</p>
                    <p className="text-sm text-cocoa">{item.customer_email}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-cocoa">Reason: {item.reason} · Condition: {item.condition}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-[140px_180px_130px]">
                <div className="rounded-md bg-linen p-3"><p className="text-xs font-bold uppercase text-cocoa">Refund</p><p className="font-semibold">{formatEUR(Number(item.refund_amount || 0))}</p></div>
                <select
                  value={item.status}
                  onChange={async (event) => {
                    await fetch("/api/admin/returns", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: item.id, status: event.target.value, notes: item.notes })
                    });
                    load();
                  }}
                  className="focus-ring rounded-md border border-black/15 px-4 py-3 capitalize"
                >
                  {statuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
                </select>
                <span className="rounded-full bg-champagne px-4 py-3 text-center text-sm font-semibold capitalize">{item.status.replaceAll("_", " ")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
