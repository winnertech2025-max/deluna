import { NextResponse } from "next/server";
import { orderCreatedEmail, sendTransactionalEmail } from "@/lib/email";
import { capturePayPalOrder } from "@/lib/paypal";
import { createServiceClient, hasSupabaseServerConfig } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const body = (await request.json()) as { token?: string; orderNumber?: string };
  const paypalOrderId = body.token;
  const orderNumber = body.orderNumber;

  if (!paypalOrderId || !orderNumber) {
    return NextResponse.json({ error: "Missing PayPal token or Deluna order number." }, { status: 400 });
  }

  if (!hasSupabaseServerConfig()) {
    return NextResponse.json({ error: "Supabase is required to capture PayPal orders." }, { status: 500 });
  }

  try {
    const capture = await capturePayPalOrder(paypalOrderId);
    if (capture.status !== "COMPLETED") {
      return NextResponse.json({ error: `PayPal capture status is ${capture.status}.` }, { status: 402 });
    }

    const supabase = createServiceClient();
    const { data: order, error } = await supabase
      .from("orders")
      .update({
        status: "confirmed",
        payment_status: "paid",
        payment_reference: paypalOrderId
      })
      .eq("order_number", orderNumber)
      .eq("payment_reference", paypalOrderId)
      .select("order_number,total_amount,customer_email,order_items(product_name,variant_name,engraving_text)")
      .single();

    if (error) throw error;

    await sendTransactionalEmail({
      to: order.customer_email,
      subject: `Deluna order ${order.order_number} confirmed`,
      html: orderCreatedEmail({
        orderNumber: order.order_number,
        total: Number(order.total_amount || 0),
        items: (order.order_items || []).map((item) =>
          `${item.product_name}${item.variant_name ? ` - ${item.variant_name}` : ""}${item.engraving_text ? ` - ${item.engraving_text}` : ""}`
        )
      })
    });

    return NextResponse.json({ orderId: order.order_number, captureId: capture.id });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Could not complete PayPal payment.",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
