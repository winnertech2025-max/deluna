import { NextResponse } from "next/server";
import { syncMolliePayment } from "@/lib/mollie-orders";

export async function POST(request: Request) {
  const formData = await request.formData();
  const paymentId = String(formData.get("id") || "");

  if (!paymentId) {
    return NextResponse.json({ ok: true });
  }

  try {
    await syncMolliePayment(paymentId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Mollie webhook]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
