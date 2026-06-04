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
          <span className="absolute left-1.5 top-1.5 bg-ink/90 px-1.5 py-1 text-[9px] font-bold uppercase text-white sm:left-2 sm:top-2 sm:px-2 sm:text-[11px]">
            Free custom
          </span>
          {product.isBestSeller ? (
            <span className="absolute right-1.5 top-1.5 rounded-full bg-orange-500 px-1.5 py-1 text-[9px] font-bold text-white sm:right-2 sm:top-2 sm:px-2 sm:text-[11px]">HOT</span>
          ) : null}
        </div>
        <div className="space-y-1.5 p-2.5 sm:space-y-2 sm:p-3">
          <h3 className="line-clamp-2 min-h-9 text-xs font-medium leading-4 text-ink sm:min-h-10 sm:text-sm sm:leading-5">{product.name}</h3>
          <div className="flex flex-wrap items-end gap-1.5 sm:gap-2">
            <span className="text-[11px] text-cocoa line-through sm:text-xs">{formatEUR(oldPrice)}</span>
            <span className="text-base font-bold text-orange-600 sm:text-lg">{formatEUR(price)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-cocoa sm:text-xs">{product.soldCount} sold</span>
            <span className="flex items-center gap-0.5 text-[11px] font-semibold sm:text-xs">
              {product.rating?.toFixed(1)}
              {Array.from({ length: 5 }).map((_, index) => (
                <FiStar key={index} className="hidden fill-ink min-[390px]:block" size={12} />
              ))}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={out ? "text-[11px] font-bold text-red-600 sm:text-xs" : "text-[11px] font-bold text-green-700 sm:text-xs"}>
              {out ? "Out of stock" : "10-14 business days"}
            </span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink text-ink sm:h-9 sm:w-9">
              <FiShoppingCart />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
