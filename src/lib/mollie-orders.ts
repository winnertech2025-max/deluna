import { orderCreatedEmail, sendTransactionalEmail } from "@/lib/email";
import { getMolliePayment, isMollieFinalFailed, isMolliePaid } from "@/lib/mollie";
import { createServiceClient, hasSupabaseServerConfig } from "@/lib/supabase/service";

type MollieSyncResult = {
  orderId?: string;
  paymentStatus: string;
  orderStatus?: string;
};

function itemLabel(item: { product_name: string; variant_name?: string | null; engraving_text?: string | null }) {
  return `${item.product_name}${item.variant_name ? ` - ${item.variant_name}` : ""}${item.engraving_text ? ` - ${item.engraving_text}` : ""}`;
}

export async function syncMolliePayment(paymentId: string): Promise<MollieSyncResult> {
  if (!hasSupabaseServerConfig()) {
    throw new Error("Supabase is required to sync Mollie payments.");
  }

  const payment = await getMolliePayment(paymentId);
  const orderNumberFromMetadata = payment.metadata?.orderNumber;
  const supabase = createServiceClient();

  let query = supabase
    .from("orders")
    .select("id,order_number,total_amount,customer_email,payment_status,status,order_items(product_name,variant_name,engraving_text)")
    .eq("payment_reference", payment.id);

  if (orderNumberFromMetadata) {
    query = query.eq("order_number", orderNumberFromMetadata);
  }

  const { data: order, error: orderError } = await query.single();
  if (orderError) throw orderError;

  if (isMolliePaid(payment.status)) {
    if (order.payment_status !== "paid") {
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "confirmed",
          payment_status: "paid",
          payment_reference: payment.id
        })
        .eq("id", order.id);

      if (updateError) throw updateError;

      await sendTransactionalEmail({
        to: order.customer_email,
        subject: `Deluna order ${order.order_number} confirmed`,
        html: orderCreatedEmail({
          orderNumber: order.order_number,
          total: Number(order.total_amount || 0),
          items: (order.order_items || []).map(itemLabel)
        })
      });
    }

    return {
      orderId: order.order_number,
      paymentStatus: "paid",
      orderStatus: "confirmed"
    };
  }

  if (isMollieFinalFailed(payment.status)) {
    const orderStatus = payment.status === "canceled" ? "cancelled" : order.status;
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: orderStatus,
        payment_status: payment.status
      })
      .eq("id", order.id);

    if (updateError) throw updateError;

    return {
      orderId: order.order_number,
      paymentStatus: payment.status,
      orderStatus
    };
  }

  await supabase
    .from("orders")
    .update({
      payment_status: payment.status
    })
    .eq("id", order.id);

  return {
    orderId: order.order_number,
    paymentStatus: payment.status,
    orderStatus: order.status
  };
}

export async function syncMollieOrderPayment(orderNumber: string): Promise<MollieSyncResult> {
  if (!hasSupabaseServerConfig()) {
    throw new Error("Supabase is required to sync Mollie payments.");
  }

  const supabase = createServiceClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("payment_reference")
    .eq("order_number", orderNumber)
    .single();

  if (error) throw error;
  if (!order.payment_reference) throw new Error("Order does not have a Mollie payment reference.");

  return syncMolliePayment(order.payment_reference);
}
