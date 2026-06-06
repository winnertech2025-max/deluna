import { FiFilter, FiSearch } from "react-icons/fi";
import { ProductCard } from "@/components/product-card";
import { getStoreProducts } from "@/lib/product-store";
import { categoryLabels } from "@/lib/products";
import type { Category, Product } from "@/types";

type Params = {
  category?: string;
  q?: string;
  best?: string;
  sort?: string;
  min?: string;
  max?: string;
  page?: string;
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const products = await getStoreProducts();
  let visible = filterProducts(params, products);
  const pageSize = 10;
  const currentPage = Math.max(1, Number(params.page || 1));
  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const pagedProducts = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const active = params.category || "all";
  const categories = Object.entries(categoryLabels) as Array<[Category, string]>;
  const suggestions = ["naam ketting", "custom tas", "initial bracelet", "custom t shirt", "personalized gift", "monogram case"];

  return (
    <div className="bg-white">
      <section className="border-b border-orange-200 bg-linen">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7">
          <form action="/shop" className="flex max-w-3xl items-center gap-2 rounded-full border-2 border-champagne bg-white px-3 py-2 shadow-sm sm:px-4">
            <FiSearch />
            <input name="q" defaultValue={params.q || ""} placeholder="Zoek gepersonaliseerde producten" className="min-w-0 flex-1 bg-transparent py-2 outline-none" />
            <button className="rounded-full bg-champagne px-4 py-2 text-sm font-semibold text-ink sm:px-5">Search</button>
          </form>
          <div className="mt-4 flex snap-x gap-2 overflow-x-auto pb-1 text-sm sm:flex-wrap sm:overflow-visible">
            <span className="shrink-0 font-semibold text-cocoa">Suggested:</span>
            {suggestions.map((item) => (
              <a key={item} href={`/shop?q=${encodeURIComponent(item)}`} className="shrink-0 snap-start rounded-full bg-white px-4 py-2 hover:bg-champagne">
                {item}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex gap-2 overflow-x-auto border-b border-black/10 pb-5 sm:flex-wrap sm:overflow-visible">
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold"><FiFilter /> Filters</span>
          <a className={pill(active === "all")} href="/shop">All</a>
          {categories.map(([key, label]) => (
            <a key={key} className={pill(active === key)} href={`/shop?category=${key}`}>{label}</a>
          ))}
          <a className={pill(params.best === "1")} href="/shop?best=1">Best sellers</a>
          <a className={pill(params.sort === "price_asc")} href={withParam(params, "sort", "price_asc")}>Price low</a>
          <a className={pill(params.sort === "price_desc")} href={withParam(params, "sort", "price_desc")}>Price high</a>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cocoa">Shop / Winkel</p>
            <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">Personaliseer jouw item</h1>
          </div>
          <p className="text-sm font-semibold text-cocoa">{visible.length} products · page {currentPage}/{totalPages}</p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">
          {pagedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} params={params} />
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, params }: { currentPage: number; totalPages: number; params: Params }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <a className={pageButton(currentPage === 1)} href={withParam(params, "page", String(Math.max(1, currentPage - 1)))}>Previous</a>
      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;
        return (
          <a key={page} href={withParam(params, "page", String(page))} className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold ${page === currentPage ? "bg-ink text-white" : "bg-linen text-ink hover:bg-champagne"}`}>
            {page}
          </a>
        );
      })}
      <a className={pageButton(currentPage === totalPages)} href={withParam(params, "page", String(Math.min(totalPages, currentPage + 1)))}>Next</a>
    </div>
  );
}

function filterProducts(params: Params, products: Product[]): Product[] {
  const q = (params.q || "").toLowerCase();
  const min = params.min ? Number(params.min) : undefined;
  const max = params.max ? Number(params.max) : undefined;
  let result = products.filter((product) => {
    const matchesCategory = !params.category || params.category === "all" || product.category === params.category;
    const matchesBest = params.best === "1" ? product.isBestSeller : true;
    const matchesQuery = q
      ? `${product.name} ${product.description} ${product.tags?.join(" ")}`.toLowerCase().includes(q)
      : true;
    const price = Math.min(...product.variants.map((variant) => variant.price));
    const matchesPrice = (min === undefined || price >= min) && (max === undefined || price <= max);
    return matchesCategory && matchesBest && matchesQuery && matchesPrice;
  });
  if (params.sort === "price_asc") result = result.sort((a, b) => a.basePrice - b.basePrice);
  if (params.sort === "price_desc") result = result.sort((a, b) => b.basePrice - a.basePrice);
  return result;
}

function pill(active: boolean) {
  return `shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-ink text-white" : "bg-linen text-ink hover:bg-champagne"}`;
}

function withParam(params: Params, key: string, value: string) {
  const next = new URLSearchParams();
  Object.entries(params).forEach(([entryKey, entryValue]) => {
    if (entryValue) next.set(entryKey, entryValue);
  });
  next.set(key, value);
  if (key !== "page") next.delete("page");
  return `/shop?${next.toString()}`;
}

function pageButton(disabled: boolean) {
  return `rounded-full px-4 py-2 text-sm font-semibold ${disabled ? "pointer-events-none bg-black/5 text-black/30" : "bg-linen text-ink hover:bg-champagne"}`;
}
