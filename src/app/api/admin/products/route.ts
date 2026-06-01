import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { products } from "@/lib/products";
import type { Product } from "@/types";

const productState = new Map(products.map((product) => [product.id, product.status]));
const productRows: Product[] = [...products];

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    products: productRows.map((product) => ({ ...product, status: productState.get(product.id) || product.status }))
  });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as Partial<Product> & { id: string };
  const index = productRows.findIndex((product) => product.id === body.id);
  if (body.status) productState.set(body.id, body.status);
  if (index >= 0) productRows[index] = { ...productRows[index], ...body } as Product;
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as Product;
  const id = body.id || `prod_${Date.now()}`;
  const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const product: Product = { ...body, id, slug };
  productRows.unshift(product);
  return NextResponse.json({ product });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = (await request.json()) as { id: string };
  const index = productRows.findIndex((product) => product.id === id);
  if (index >= 0) productRows.splice(index, 1);
  return NextResponse.json({ ok: true });
}
