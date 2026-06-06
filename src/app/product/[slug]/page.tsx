import { notFound } from "next/navigation";
import { ProductCustomizer } from "@/components/product-customizer";
import { ProductCard } from "@/components/product-card";
import { getStoreProductBySlug, getStoreProducts } from "@/lib/product-store";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getStoreProductBySlug(slug);
  if (!product) notFound();
  const products = await getStoreProducts();
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <ProductCustomizer product={product} />
      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-ink">More from this category</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
