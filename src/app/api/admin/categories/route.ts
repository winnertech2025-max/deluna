import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { allCategoryItems } from "@/lib/category-menu";

type AdminCategory = { id: string; slug: string; name: string; needsSizes: boolean; parentSlug?: string | null };

const categories: AdminCategory[] = allCategoryItems.map((item) => ({
  id: item.slug,
  slug: item.slug,
  name: item.label,
  parentSlug: item.parentSlug,
  needsSizes: ["t-shirts", "hoodies", "sweaters", "caps-hats"].includes(item.slug)
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
