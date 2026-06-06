import { NextResponse } from "next/server";
import { orderCreatedEmail, sendTransactionalEmail } from "@/lib/email";
import { createPayPalOrder } from "@/lib/paypal";
import { products } from "@/lib/products";
import { createServiceClient, hasSupabaseServerConfig } from "@/lib/supabase/service";
import type { CartItem } from "@/types";

const memoryOrders: unknown[] = [];

function getProductImage(productName: string) {
  return products.find((product) => product.name.toLowerCase() === productName.toLowerCase())?.image || products[0].image;
}

export async function POST(request: Request) {
  const payload = await request.json();
  if (hasSupabaseServerConfig()) {
    try {
      const supabase = createServiceClient();
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: payload.customer?.name || "Guest",
          customer_email: payload.customer?.email || "guest@example.com",
          customer_phone: payload.customer?.phone || null,
          shipping_address: payload.customer?.address || "",
          total_amount: Number(payload.total || 0),
          currency: "EUR",
          payment_method: payload.paymentMethod || "cod",
          status: "pending"
        })
        .select("id, order_number, status, created_at")
        .single();

      if (orderError) throw orderError;

      const items = (payload.items || []) as CartItem[];
      if (items.length > 0) {
        const orderItems = items.map((item) => {
          const variant = item.product.variants.find((candidate) => candidate.id === item.variantId);
          return {
            order_id: order.id,
            product_id: null,
            variant_id: null,
            product_name: item.product.name,
            variant_name: variant?.name || null,
            quantity: item.quantity,
            unit_price: variant?.price || item.product.basePrice,
            engraving_text: item.engravingText,
            engraving_font: item.font,
            engraving_color: item.color,
            preview_url: item.previewUrl || null
          };
        });
        const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
        if (itemsError) throw itemsError;
      }

      if (payload.paymentMethod === "paypal") {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
        const paypal = await createPayPalOrder({
          orderNumber: order.order_number,
          total: Number(payload.total || 0),
          currency: "EUR",
          description: `Deluna Studio order ${order.order_number}`,
          returnUrl: `${siteUrl}/paypal/complete?order=${encodeURIComponent(order.order_number)}`,
          cancelUrl: `${siteUrl}/checkout?paypal=cancelled`
        });

        await supabase
          .from("orders")
          .update({
            payment_reference: paypal.paypalOrderId,
            payment_status: "pending"
          })
          .eq("id", order.id);

        return NextResponse.json({
          orderId: order.order_number,
          approvalUrl: paypal.approvalUrl,
          paypalOrderId: paypal.paypalOrderId,
          source: "paypal"
        });
      }

      await sendOrderConfirmationEmail({
        email: payload.customer?.email || "guest@example.com",
        orderNumber: order.order_number,
        total: Number(payload.total || 0),
        items
      });

      return NextResponse.json({
        orderId: order.order_number,
        order: {
          id: order.order_number,
          status: order.status,
          createdAt: order.created_at,
          ...payload
        },
        source: "supabase"
      });
    } catch (error) {
      return NextResponse.json(
        {
          error: "Could not create order in Supabase.",
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
  }

  const order = {
    id: `DLN-${Date.now().toString().slice(-8)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    ...payload
  };
  memoryOrders.unshift(order);
  return NextResponse.json({ orderId: order.id, order });
}

async function sendOrderConfirmationEmail({ email, orderNumber, total, items }: { email: string; orderNumber: string; total: number; items: CartItem[] }) {
  await sendTransactionalEmail({
    to: email,
    subject: `Deluna order ${orderNumber} confirmed`,
    html: orderCreatedEmail({
      orderNumber,
      total,
      items: items.map((item) => {
        const variant = item.product.variants.find((candidate) => candidate.id === item.variantId);
        return `${item.product.name}${variant ? ` - ${variant.name}` : ""}${item.engravingText ? ` - ${item.engravingText}` : ""}`;
      })
    })
  });
}

export async function GET() {
  if (hasSupabaseServerConfig()) {
    try {
      const supabase = createServiceClient();
      const { data, error } = await supabase
        .from("orders")
        .select("order_number,status,tracking_number,created_at,total_amount,payment_method,shipping_address,order_items(product_name,variant_name,engraving_text,engraving_font,engraving_color,quantity,unit_price,preview_url)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json({
        orders: (data || []).map((order) => ({
          id: order.order_number,
          status: order.status,
          trackingNumber: order.tracking_number,
          item: order.order_items?.[0]?.product_name || "Custom Deluna order",
          updatedAt: order.created_at,
          total: order.total_amount,
          paymentMethod: order.payment_method,
          address: order.shipping_address,
          items: (order.order_items || []).map((item) => ({
            name: item.product_name,
            variant: item.variant_name,
            engravingText: item.engraving_text,
            engravingFont: item.engraving_font,
            engravingColor: item.engraving_color,
            quantity: item.quantity,
            unitPrice: Number(item.unit_price),
            image: getProductImage(item.product_name),
            previewUrl: item.preview_url
          }))
        })),
        demoTracking: []
      });
    } catch (error) {
      return NextResponse.json(
        {
          error: "Could not read orders from Supabase.",
          details: error instanceof Error ? error.message : String(error),
          orders: memoryOrders
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    orders: memoryOrders,
    demoTracking: [
      { id: "DLN-10293014", status: "in_production", item: products[0].name, updatedAt: new Date().toISOString() },
      { id: "DLN-10283197", status: "shipped", item: products[3].name, updatedAt: new Date().toISOString() }
    ]
  });
}
