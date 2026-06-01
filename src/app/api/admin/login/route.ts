import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminCookieName, getAdminCredentials } from "@/lib/admin";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const credentials = getAdminCredentials();
  if (body.email === credentials.email && body.password === credentials.password) {
    const cookieStore = await cookies();
    cookieStore.set(adminCookieName, "ok", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12
    });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: "Invalid admin credentials" }, { status: 401 });
}
