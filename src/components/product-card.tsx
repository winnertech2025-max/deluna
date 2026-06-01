import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import { formatEUR } from "@/lib/money";
import { getLowestPrice } from "@/lib/products";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const out = product.status === "out_of_stock";
  const price = getLowestPrice(product);
  const oldPrice = price * 1.23;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <article className="relative overflow-hidden rounded-md border border-black/10 bg-white transition hover:-translate-y-0.5 hover:shadow-soft">
        <div className="relative aspect-[4/5] bg-nude/30">
          <Image src={product.image} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" />
          <span className="absolute left-2 top-2 bg-ink/90 px-2 py-1 text-[11px] font-bold uppercase text-white">
            Free personalization
          </span>
          {product.isBestSeller ? (
            <span className="absolute right-2 top-2 rounded-full bg-orange-500 px-2 py-1 text-[11px] font-bold text-white">HOT</span>
          ) : null}
        </div>
        <div className="space-y-2 p-3">
          <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-ink">{product.name}</h3>
          <div className="flex items-end gap-2">
            <span className="text-xs text-cocoa line-through">{formatEUR(oldPrice)}</span>
            <span className="text-lg font-bold text-orange-600">{formatEUR(price)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-cocoa">{product.soldCount} sold</span>
            <span className="flex items-center gap-0.5 text-xs font-semibold">
              {product.rating?.toFixed(1)}
              {Array.from({ length: 5 }).map((_, index) => (
                <FiStar key={index} className="fill-ink" size={12} />
              ))}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={out ? "text-xs font-bold text-red-600" : "text-xs font-bold text-green-700"}>
              {out ? "Out of stock" : "10-14 business days"}
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-ink text-ink">
              <FiShoppingCart />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
