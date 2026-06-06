import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { categoryLabels } from "@/lib/products";
import { getAdminProducts } from "@/lib/product-store";
import { createServiceClient, hasSupabaseServerConfig } from "@/lib/supabase/service";
import type { Category, Product, ProductVariant } from "@/types";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function getCategoryId(category: Category) {
  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", category)
    .maybeSingle();

  if (existing?.id) return existing.id as string;

  const { data, error } = await supabase
    .from("categories")
    .insert({
      slug: category,
      name: categoryLabels[category] || category,
      needs_sizes: category === "clothing" || category === "kids"
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

function productPayload(product: Product, categoryId: string) {
  const variants = product.variants?.length ? product.variants : [];
  const defaultVariant = variants.find((variant) => variant.isDefault) || variants[0];
  const basePrice = defaultVariant?.price || product.basePrice || 0;

  return {
    category_id: categoryId,
    slug: product.slug || slugify(product.name),
    name: product.name,
    description: product.description || "",
    image_url: product.image,
    gallery_urls: product.gallery || [],
    base_price: basePrice,
    currency: "EUR",
    status: product.status || "active",
    is_best_seller: Boolean(product.isBestSeller),
    rating: product.rating || 4.8,
    sold_count: product.soldCount || 0,
    tags: product.tags || ["Free personalization"],
    is_personalizable: product.isPersonalizable ?? true,
    personalization_label: product.personalization?.label || "Name, text, or initials",
    personalization_max_length: product.personalization?.maxLength || 18,
    personalization_placement: product.personalization?.placement || "front center",
    personalization_fonts: product.personalization?.fonts || ["Serif", "Script", "Modern", "Minimal"],
    personalization_colors: product.personalization?.colors || ["Champagne Gold", "Soft Black", "Ivory", "Rose Nude"],
    delivery_days: product.deliveryDays || "10-14 business days",
    temu_reference: product.temuReference || null,
    updated_at: new Date().toISOString()
  };
}

async function replaceVariants(productId: string, variants: ProductVariant[]) {
  const supabase = createServiceClient();
  await supabase.from("product_variants").delete().eq("product_id", productId);

  const rows = (variants.length ? variants : [{ id: "standard", name: "Standard", price: 0, stock: 0, isDefault: true }]).map((variant, index) => ({
    product_id: productId,
    name: variant.name || "Standard",
    price: variant.price || 0,
    stock: variant.stock || 0,
    is_default: variants.some((item) => item.isDefault) ? Boolean(variant.isDefault) : index === 0
  }));

  const { error } = await supabase.from("product_variants").insert(rows);
  if (error) throw error;
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const products = await getAdminProducts();
  return NextResponse.json({ products });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasSupabaseServerConfig()) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });

  const product = (await request.json()) as Product;
  const categoryId = await getCategoryId(product.category);
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .update(productPayload(product, categoryId))
    .eq("id", product.id)
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await replaceVariants(data.id, product.variants || []);
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasSupabaseServerConfig()) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });

  const product = (await request.json()) as Product;
  const categoryId = await getCategoryId(product.category);
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .insert(productPayload({ ...product, slug: product.slug || slugify(product.name) }, categoryId))
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await replaceVariants(data.id, product.variants || []);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasSupabaseServerConfig()) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });

  const { id } = (await request.json()) as { id: string };
  const supabase = createServiceClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

