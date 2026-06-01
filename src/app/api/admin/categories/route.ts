import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { categoryLabels } from "@/lib/products";

type AdminCategory = { id: string; slug: string; name: string; needsSizes: boolean };

const categories: AdminCategory[] = Object.entries(categoryLabels).map(([slug, name]) => ({
  id: slug,
  slug,
  name,
  needsSizes: slug === "clothing"
}));

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as AdminCategory;
  const category = { ...body, id: body.slug || crypto.randomUUID() };
  categories.push(category);
  return NextResponse.json({ category });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as AdminCategory;
  const index = categories.findIndex((category) => category.id === body.id);
  if (index >= 0) categories[index] = { ...categories[index], ...body };
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = (await request.json()) as { id: string };
  const index = categories.findIndex((category) => category.id === id);
  if (index >= 0) categories.splice(index, 1);
  return NextResponse.json({ ok: true });
}
