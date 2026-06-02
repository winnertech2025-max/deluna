"use client";

import { useEffect, useState } from "react";
import { FiImage, FiMinusCircle } from "react-icons/fi";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/button";
import { T } from "@/components/t";
import { formatEUR } from "@/lib/money";
import { getLowestPrice } from "@/lib/products";
import type { Category, Product, ProductVariant } from "@/types";

type EditingProduct = Partial<Product> & {
  costPrice?: number;
  discountPrice?: number;
  imagesText?: string;
  variantsDraft?: ProductVariant[];
};

const emptyProduct: EditingProduct = {
  name: "",
  category: "clothing",
  description: "",
  image: "",
  imagesText: "",
  status: "active",
  isBestSeller: false,
  variantsDraft: [
    { id: "S", name: "S", price: 19.9, isDefault: false, stock: 20 },
    { id: "M", name: "M", price: 21.9, isDefault: true, stock: 20 },
    { id: "L", name: "L", price: 23.9, isDefault: false, stock: 20 }
  ]
};

function defaultVariantsForCategory(category: string): ProductVariant[] {
  if (category === "clothing") return emptyProduct.variantsDraft || [];
  if (category === "kids") {
    return [
      { id: "2-3Y", name: "2-3Y", price: 13.9, isDefault: true, stock: 20 },
      { id: "4-5Y", name: "4-5Y", price: 15.9, isDefault: false, stock: 20 },
      { id: "6-7Y", name: "6-7Y", price: 17.9, isDefault: false, stock: 20 }
    ];
  }
  return [{ id: "standard", name: "Standard", price: 15, isDefault: true, stock: 20 }];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState<"create" | "edit" | "view" | null>(null);
  const [draft, setDraft] = useState<EditingProduct>(emptyProduct);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const visibleProducts = products.slice((page - 1) * pageSize, page * pageSize);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/products");
    if (response.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    const data = await response.json();
    setProducts(data.products);
    setLoading(false);
  }

  function openCreate() {
    setDraft({ ...emptyProduct, variantsDraft: [...(emptyProduct.variantsDraft || [])] });
    setModal("create");
  }

  function openProduct(product: Product, mode: "edit" | "view") {
    setDraft({
      ...product,
      imagesText: [product.image, ...product.gallery].filter(Boolean).join("\n"),
      variantsDraft: product.variants.map((variant) => ({ ...variant }))
    });
    setModal(mode);
  }

  async function save() {
    const variantsSource = draft.variantsDraft?.length ? draft.variantsDraft : [{ id: "standard", name: "Standard", price: 0, isDefault: true, stock: 0 }];
    const hasDefault = variantsSource.some((variant) => variant.isDefault);
    const variants = variantsSource.map((variant, index) => ({ ...variant, isDefault: hasDefault ? Boolean(variant.isDefault) : index === 0 }));
    const images = (draft.imagesText || "").split("\n").map((item) => item.trim()).filter(Boolean);
    const product = {
      id: draft.id || "",
      slug: draft.slug || "",
      name: draft.name || "Untitled product",
      category: draft.category || "clothing",
      description: draft.description || "",
      image: images[0] || draft.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
      gallery: images.slice(1),
      basePrice: variants.find((variant) => variant.isDefault)?.price || variants[0]?.price || 0,
      currency: "EUR",
      status: draft.status || "active",
      isBestSeller: Boolean(draft.isBestSeller),
      isPersonalizable: true,
      personalization: draft.personalization || { label: "Name, text, or initials", maxLength: 18, placement: "front center", fonts: ["Serif", "Script", "Modern"], colors: ["Champagne Gold", "Soft Black"] },
      variants,
      deliveryDays: "10-14 business days",
      rating: draft.rating || 4.8,
      soldCount: draft.soldCount || 0,
      tags: draft.tags || ["Free personalization"]
    };
    await fetch("/api/admin/products", {
      method: draft.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    setModal(null);
    setPage(1);
    load();
  }

  async function remove(id: string) {
    await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cocoa">Catalog</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink"><T k="productManagement" /></h1>
        </div>
        <Button onClick={openCreate}><T k="createProduct" /></Button>
      </div>
      <div className="mt-8 overflow-x-auto rounded-lg border border-black/10 bg-white">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <thead className="bg-ink text-white">
            <tr><th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Images</th><th className="p-4">Lowest price</th><th className="p-4">Default</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="border-t border-black/10">
                  <td className="p-4" colSpan={7}><div className="h-14 animate-pulse rounded-md bg-linen" /></td>
                </tr>
              ))
            ) : null}
            {!loading && visibleProducts.map((product) => (
              <tr key={product.id} className="border-t border-black/10">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-md bg-linen">
                      {product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-cocoa"><FiImage /></div>}
                    </div>
                    <div>
                      <p className="font-semibold">{product.name}{product.isBestSeller ? <span className="ml-2 rounded bg-orange-100 px-2 py-1 text-xs text-orange-700">Best seller</span> : null}</p>
                      <p className="mt-1 text-xs text-cocoa">{product.variants.length} variant(s)</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 capitalize">{product.category}</td>
                <td className="p-4">{1 + product.gallery.length}</td>
                <td className="p-4">{formatEUR(getLowestPrice(product))}</td>
                <td className="p-4">{product.variants.find((variant) => variant.isDefault)?.name}</td>
                <td className="p-4 capitalize">{product.status.replaceAll("_", " ")}</td>
                <td className="space-x-2 p-4">
                  <Button variant="secondary" onClick={() => openProduct(product, "view")}>View</Button>
                  <Button variant="secondary" onClick={() => openProduct(product, "edit")}>Edit</Button>
                  <Button variant="ghost" onClick={() => remove(product.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminPagination page={page} totalPages={totalPages} onPage={setPage} />

      {modal ? (
        <ProductModal
          mode={modal}
          draft={draft}
          setDraft={setDraft}
          onClose={() => setModal(null)}
          onSave={save}
        />
      ) : null}
    </AdminShell>
  );
}

function AdminPagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (page: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2">
      <button disabled={page === 1} onClick={() => onPage(page - 1)} className="rounded-full bg-linen px-4 py-2 text-sm font-semibold disabled:opacity-40">Previous</button>
      {Array.from({ length: totalPages }).map((_, index) => (
        <button key={index} onClick={() => onPage(index + 1)} className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold ${page === index + 1 ? "bg-ink text-white" : "bg-linen text-ink"}`}>
          {index + 1}
        </button>
      ))}
      <button disabled={page === totalPages} onClick={() => onPage(page + 1)} className="rounded-full bg-linen px-4 py-2 text-sm font-semibold disabled:opacity-40">Next</button>
    </div>
  );
}

function ProductModal({ mode, draft, setDraft, onClose, onSave }: {
  mode: "create" | "edit" | "view";
  draft: EditingProduct;
  setDraft: (product: EditingProduct) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const readonly = mode === "view";
  const variants = draft.variantsDraft || [];
  const images = (draft.imagesText || "").split("\n").map((item) => item.trim()).filter(Boolean);

  function setVariant(index: number, patch: Partial<ProductVariant>) {
    setDraft({ ...draft, variantsDraft: variants.map((variant, i) => i === index ? { ...variant, ...patch } : patch.isDefault ? { ...variant, isDefault: false } : variant) });
  }

  function removeVariant(index: number) {
    if (readonly || variants.length <= 1) return;
    const nextVariants = variants.filter((_, i) => i !== index);
    const hasDefault = nextVariants.some((variant) => variant.isDefault);
    setDraft({
      ...draft,
      variantsDraft: nextVariants.map((variant, i) => ({ ...variant, isDefault: hasDefault ? Boolean(variant.isDefault) : i === 0 }))
    });
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/55 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-soft">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-black/10 bg-white px-6 py-5">
          <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cocoa">{mode} product</p><h2 className="mt-2 text-3xl font-semibold text-ink">{draft.name || "New product"}</h2></div>
          <button onClick={onClose} className="rounded-md px-3 py-2 hover:bg-linen">Close</button>
        </div>
        <div className="grid gap-5 p-6 xl:grid-cols-[1fr_420px]">
          <div className="space-y-4">
            <input disabled={readonly} value={draft.name || ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Product name" className="focus-ring w-full rounded-md border border-black/15 px-4 py-3" />
            <select disabled={readonly} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Category, variantsDraft: defaultVariantsForCategory(e.target.value) })} className="focus-ring w-full rounded-md border border-black/15 px-4 py-3">
              {["clothing", "kids", "jewelry", "bags", "hats", "gifts", "accessories"].map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <div className="rounded-lg border border-black/10 bg-white p-3">
              <textarea disabled={readonly} value={draft.imagesText || ""} onChange={(e) => setDraft({ ...draft, imagesText: e.target.value })} rows={5} placeholder="Image URLs, one per line" className="focus-ring w-full rounded-md border border-black/15 px-4 py-3" />
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(images.length ? images : [draft.image || ""]).filter(Boolean).slice(0, 8).map((image, index) => (
                  <div key={`${image}-${index}`} className="overflow-hidden rounded-md border border-black/10 bg-linen">
                    <div className="aspect-square">
                      <img src={image} alt={`Product image ${index + 1}`} className="h-full w-full object-cover" />
                    </div>
                    <p className="truncate px-2 py-1 text-xs text-cocoa">{index === 0 ? "Main image" : `Gallery ${index}`}</p>
                  </div>
                ))}
                {images.length === 0 && !draft.image ? (
                  <div className="grid aspect-square place-items-center rounded-md border border-dashed border-black/15 bg-linen text-cocoa">
                    <FiImage />
                  </div>
                ) : null}
              </div>
            </div>
            <div className="rounded-lg border border-black/10 p-3">
              <div className="mb-2 flex items-center justify-between"><p className="font-semibold">Variants / sizes</p>{!readonly ? <Button variant="secondary" onClick={() => setDraft({ ...draft, variantsDraft: [...variants, { id: `v${variants.length + 1}`, name: "New", price: 0, stock: 0, isDefault: false }] })}>Add variant</Button> : null}</div>
              <div className="space-y-2">
                {variants.map((variant, index) => (
                  <div key={`${variant.id}-${index}`} className="grid gap-2 rounded-md bg-linen p-3 sm:grid-cols-2 xl:grid-cols-[1fr_120px_120px_100px_auto_auto]">
                    <input disabled={readonly} value={variant.name} onChange={(e) => setVariant(index, { name: e.target.value })} className="rounded border border-black/10 px-3 py-2" placeholder="Size/name" />
                    <input disabled={readonly} type="number" step="0.01" value={variant.price} onChange={(e) => setVariant(index, { price: Number(e.target.value) })} className="rounded border border-black/10 px-3 py-2" placeholder="Sale price" />
                    <input disabled={readonly} type="number" step="0.01" value={draft.costPrice || ""} onChange={(e) => setDraft({ ...draft, costPrice: Number(e.target.value) })} className="rounded border border-black/10 px-3 py-2" placeholder="Cost price" />
                    <input disabled={readonly} type="number" value={variant.stock || 0} onChange={(e) => setVariant(index, { stock: Number(e.target.value) })} className="rounded border border-black/10 px-3 py-2" placeholder="Stock" />
                    <label className="flex items-center gap-2 text-sm"><input disabled={readonly} type="radio" checked={Boolean(variant.isDefault)} onChange={() => setVariant(index, { isDefault: true })} /> Default</label>
                    {!readonly ? (
                      <button
                        type="button"
                        disabled={variants.length <= 1}
                        onClick={() => removeVariant(index)}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <FiMinusCircle /> Remove
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4 rounded-lg border border-black/10 bg-linen p-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <label className="flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold"><input disabled={readonly} checked={Boolean(draft.isBestSeller)} onChange={(e) => setDraft({ ...draft, isBestSeller: e.target.checked })} type="checkbox" /> Best seller</label>
              <select disabled={readonly} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Product["status"] })} className="focus-ring w-full rounded-md border border-black/15 bg-white px-4 py-3">
                <option value="active">Active</option><option value="out_of_stock">Out of stock</option><option value="draft">Draft</option>
              </select>
            </div>
            <input disabled={readonly} value={draft.personalization?.placement || ""} onChange={(e) => setDraft({ ...draft, personalization: { ...(draft.personalization || { label: "Name, text, or initials", maxLength: 18, fonts: [], colors: [] }), placement: e.target.value } })} placeholder="Engraving/print placement" className="focus-ring w-full rounded-md border border-black/15 px-4 py-3" />
            <div>
              <p className="mb-2 text-sm font-semibold">Product description editor</p>
              <div className="rounded-t-md border border-black/15 bg-linen px-3 py-2 text-xs font-semibold text-cocoa">Rich text toolbar placeholder: Bold · Italic · List · Link</div>
              <textarea disabled={readonly} value={draft.description || ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={12} className="focus-ring w-full rounded-b-md border border-t-0 border-black/15 px-4 py-3" />
              <p className="mt-2 text-xs text-cocoa">This is structured so React Quill can replace the textarea cleanly when the package is enabled.</p>
            </div>
          </div>
        </div>
        {!readonly ? <div className="border-t border-black/10 px-6 py-5"><Button onClick={onSave}>Save product</Button></div> : null}
      </div>
    </div>
  );
}
