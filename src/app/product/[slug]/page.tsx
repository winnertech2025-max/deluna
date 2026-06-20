import { notFound } from "next/navigation";
import { ProductCustomizer } from "@/components/product-customizer";
import { RelatedProducts } from "@/components/related-products";
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
      <RelatedProducts products={related} />
    </div>
  );
}
