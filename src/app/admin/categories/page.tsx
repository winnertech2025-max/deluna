"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/button";

type Category = { id: string; slug: string; name: string; needsSizes: boolean };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(categories.length / pageSize));
  const visibleCategories = categories.slice((page - 1) * pageSize, page * pageSize);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/categories");
    if (response.status === 401) window.location.href = "/admin/login";
    const data = await response.json();
    setCategories(data.categories || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <AdminShell>
      <h1 className="text-4xl font-semibold text-ink">Category management</h1>
      <form
        className="mt-6 grid gap-3 rounded-lg border border-black/10 bg-white p-5 md:grid-cols-[1fr_1fr_auto_auto]"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: form.get("slug"), name: form.get("name"), needsSizes: form.get("needsSizes") === "on" })
          });
          event.currentTarget.reset();
          setPage(1);
          load();
        }}
      >
        <input name="name" required placeholder="Category name" className="focus-ring rounded-md border border-black/15 px-4 py-3" />
        <input name="slug" required placeholder="Slug" className="focus-ring rounded-md border border-black/15 px-4 py-3" />
        <label className="flex items-center gap-2 rounded-md bg-linen px-4 py-3 text-sm font-semibold"><input name="needsSizes" type="checkbox" /> S/M/L sizes</label>
        <Button>Create</Button>
      </form>
      <div className="mt-8 grid gap-3">
        {loading ? Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-20 animate-pulse rounded-lg bg-white" />) : null}
        {!loading && visibleCategories.map((category) => (
          <div key={category.id} className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-4">
            <div>
              <p className="font-semibold">{category.name}</p>
              <p className="text-sm text-cocoa">{category.slug} · {category.needsSizes ? "requires size pricing" : "simple variant pricing"}</p>
            </div>
            <Button variant="ghost" onClick={async () => { await fetch("/api/admin/categories", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: category.id }) }); load(); }}>Delete</Button>
          </div>
        ))}
      </div>
      {totalPages > 1 ? (
        <div className="mt-6 flex justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-full bg-linen px-4 py-2 text-sm font-semibold disabled:opacity-40">Previous</button>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button key={index} onClick={() => setPage(index + 1)} className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold ${page === index + 1 ? "bg-ink text-white" : "bg-linen text-ink"}`}>
              {index + 1}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded-full bg-linen px-4 py-2 text-sm font-semibold disabled:opacity-40">Next</button>
        </div>
      ) : null}
    </AdminShell>
  );
}
