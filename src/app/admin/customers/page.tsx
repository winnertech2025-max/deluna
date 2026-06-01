"use client";

import { useEffect, useState } from "react";
import { FiMail, FiMapPin, FiPhone, FiShoppingBag, FiUser } from "react-icons/fi";
import { AdminShell } from "@/components/admin-shell";
import { formatEUR } from "@/lib/money";

type Customer = {
  name: string;
  email: string;
  phone: string | null;
  address: string;
  orderCount: number;
  deliveredRevenue: number;
  lastOrderAt: string | null;
  statuses: string[];
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(customers.length / pageSize));
  const visible = customers.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data.customers || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cocoa">Customer studio</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">Customer management</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-cocoa">
          Customers are grouped from real orders, including contact details, order count and delivered revenue.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-black/10 bg-white p-5"><FiUser /><p className="mt-4 text-sm text-cocoa">Customers</p><p className="text-3xl font-semibold">{customers.length}</p></div>
        <div className="rounded-lg border border-black/10 bg-white p-5"><FiShoppingBag /><p className="mt-4 text-sm text-cocoa">Total orders</p><p className="text-3xl font-semibold">{customers.reduce((sum, item) => sum + item.orderCount, 0)}</p></div>
        <div className="rounded-lg border border-black/10 bg-white p-5"><FiMail /><p className="mt-4 text-sm text-cocoa">Delivered revenue</p><p className="text-3xl font-semibold">{formatEUR(customers.reduce((sum, item) => sum + item.deliveredRevenue, 0))}</p></div>
      </div>

      <div className="mt-8 grid gap-4">
        {loading ? Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-lg bg-white" />) : null}
        {!loading && visible.map((customer) => (
          <div key={customer.email} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-xl font-semibold text-ink">{customer.name}</p>
                <div className="mt-3 grid gap-2 text-sm text-cocoa">
                  <span className="inline-flex items-center gap-2"><FiMail /> {customer.email}</span>
                  <span className="inline-flex items-center gap-2"><FiPhone /> {customer.phone || "No phone"}</span>
                  <span className="inline-flex items-center gap-2"><FiMapPin /> {customer.address || "No address"}</span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 md:min-w-[360px]">
                <Stat label="Orders" value={String(customer.orderCount)} />
                <Stat label="Revenue" value={formatEUR(customer.deliveredRevenue)} />
                <Stat label="Last order" value={customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString("en-GB") : "-"} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="mt-6 flex justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-full bg-linen px-4 py-2 text-sm font-semibold disabled:opacity-40">Previous</button>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button key={index} onClick={() => setPage(index + 1)} className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold ${page === index + 1 ? "bg-ink text-white" : "bg-linen text-ink"}`}>{index + 1}</button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded-full bg-linen px-4 py-2 text-sm font-semibold disabled:opacity-40">Next</button>
        </div>
      ) : null}
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-linen p-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-cocoa">{label}</p>
      <p className="mt-1 font-semibold text-ink">{value}</p>
    </div>
  );
}
