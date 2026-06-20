import { products as fallbackProducts } from "@/lib/products";
import { createServiceClient, hasSupabaseServerConfig } from "@/lib/supabase/service";
import type { Category, Product, ProductVariant } from "@/types";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  gallery_urls: string[] | null;
  base_price: number | string;
  currency: string;
  status: Product["status"];
  is_best_seller: boolean | null;
  rating: number | string | null;
  sold_count: number | null;
  tags: string[] | null;
  is_personalizable: boolean | null;
  personalization_label: string | null;
  personalization_max_length: number | null;
  personalization_placement: string | null;
  personalization_fonts: string[] | null;
  personalization_colors: string[] | null;
  delivery_days: string | null;
  temu_reference: string | null;
  categories?: { slug: string | null } | Array<{ slug: string | null }> | null;
  product_variants?: VariantRow[] | null;
};

type VariantRow = {
  id: string;
  name: string;
  price: number | string;
  stock: number | null;
  is_default: boolean | null;
};

function toCategory(value?: string | null): Category {
  return value || "personalized-accessories";
}

function toNumber(value: number | string | null | undefined, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function mapVariant(row: VariantRow): ProductVariant {
  return {
    id: row.id,
    name: row.name,
    price: toNumber(row.price),
    stock: row.stock || 0,
    isDefault: Boolean(row.is_default)
  };
}

function mapProduct(row: ProductRow): Product {
  const variants = (row.product_variants || []).map(mapVariant);
  const basePrice = toNumber(row.base_price);
  const category = Array.isArray(row.categories) ? row.categories[0]?.slug : row.categories?.slug;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: toCategory(category),
    description: row.description,
    image: row.image_url,
    gallery: row.gallery_urls || [],
    basePrice,
    price: basePrice,
    currency: "EUR",
    status: row.status,
    isBestSeller: Boolean(row.is_best_seller),
    rating: toNumber(row.rating, 4.8),
    soldCount: row.sold_count || 0,
    tags: row.tags || [],
    isPersonalizable: row.is_personalizable ?? true,
    personalization: {
      label: row.personalization_label || "Name, text, or initials",
      maxLength: row.personalization_max_length || 18,
      placement: row.personalization_placement || "front center",
      fonts: row.personalization_fonts || ["Serif", "Script", "Modern", "Minimal"],
      colors: row.personalization_colors || ["Champagne Gold", "Soft Black", "Ivory", "Rose Nude"]
    },
    variants: variants.length ? variants : [{ id: `${row.id}-standard`, name: "Standard", price: basePrice, stock: 0, isDefault: true }],
    deliveryDays: row.delivery_days || "10-14 business days",
    temuReference: row.temu_reference || undefined
  };
}

export async function getStoreProducts() {
  if (!hasSupabaseServerConfig()) return fallbackProducts;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      description,
      image_url,
      gallery_urls,
      base_price,
      currency,
      status,
      is_best_seller,
      rating,
      sold_count,
      tags,
      is_personalizable,
      personalization_label,
      personalization_max_length,
      personalization_placement,
      personalization_fonts,
      personalization_colors,
      delivery_days,
      temu_reference,
      categories(slug),
      product_variants(id,name,price,stock,is_default)
    `)
    .in("status", ["active", "out_of_stock"])
    .order("created_at", { ascending: true });

  if (error || !data?.length) return fallbackProducts;
  return (data as unknown as ProductRow[]).map(mapProduct);
}

export async function getAdminProducts() {
  if (!hasSupabaseServerConfig()) return fallbackProducts;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      description,
      image_url,
      gallery_urls,
      base_price,
      currency,
      status,
      is_best_seller,
      rating,
      sold_count,
      tags,
      is_personalizable,
      personalization_label,
      personalization_max_length,
      personalization_placement,
      personalization_fonts,
      personalization_colors,
      delivery_days,
      temu_reference,
      categories(slug),
      product_variants(id,name,price,stock,is_default)
    `)
    .order("created_at", { ascending: true });

  if (error || !data?.length) return fallbackProducts;
  return (data as unknown as ProductRow[]).map(mapProduct);
}

export async function getStoreProductBySlug(slug: string) {
  const products = await getStoreProducts();
  return products.find((product) => product.slug === slug);
}
