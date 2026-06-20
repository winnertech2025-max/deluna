import { NextResponse } from "next/server";
import { syncMollieOrderPayment, syncMolliePayment } from "@/lib/mollie-orders";

export async function POST(request: Request) {
  const body = (await request.json()) as { paymentId?: string; orderNumber?: string };

  if (!body.paymentId && !body.orderNumber) {
    return NextResponse.json({ error: "Missing Mollie payment id or Deluna order number." }, { status: 400 });
  }

  try {
    const result = body.paymentId
      ? await syncMolliePayment(body.paymentId)
      : await syncMollieOrderPayment(body.orderNumber!);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Could not sync Mollie payment.",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
