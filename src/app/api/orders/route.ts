import { NextResponse } from "next/server";
import { calculateCheckoutTotals, type CustomerType, type ShippingCountry } from "@/lib/checkout-rules";
import { orderCreatedEmail, sendTransactionalEmail } from "@/lib/email";
import { saveNewsletterConsent } from "@/lib/newsletter";
import { createPayPalOrder } from "@/lib/paypal";
import { products } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient, hasSupabaseServerConfig } from "@/lib/supabase/service";
import type { CartItem } from "@/types";

const memoryOrders: unknown[] = [];

function getProductImage(productName: string) {
  return products.find((product) => product.name.toLowerCase() === productName.toLowerCase())?.image || products[0].image;
}

async function getCurrentUserId() {
  if (!hasSupabaseServerConfig()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id || null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const payload = await request.json();
  const items = (payload.items || []) as CartItem[];
  const subtotal = items.reduce((sum, item) => {
    const variant = item.product.variants.find((candidate) => candidate.id === item.variantId);
    return sum + (variant?.price || item.product.basePrice) * item.quantity;
  }, 0);
  const country = (payload.customer?.country || "NL") as ShippingCountry;
  const customerType = (payload.customer?.customerType || "private") as CustomerType;
  const totals = calculateCheckoutTotals({
    subtotalGross: subtotal,
    country,
    customerType,
    vatNumber: payload.customer?.vatNumber || ""
  });

  if (!totals.vatValid) {
    return NextResponse.json({ error: "Invalid EU VAT number." }, { status: 400 });
  }

  if (hasSupabaseServerConfig()) {
    try {
      const supabase = createServiceClient();
      const userId = await getCurrentUserId();
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          customer_name: payload.customer?.name || "Guest",
          customer_email: payload.customer?.email || "guest@example.com",
          customer_phone: payload.customer?.phone || null,
          shipping_address: payload.customer?.address || "",
          shipping_country: country,
          customer_type: customerType,
          vat_number: totals.vatNumber || null,
          vat_exempt: totals.vatExempt,
          vat_amount: totals.vatAmount,
          shipping_amount: totals.shippingGross,
          newsletter_opt_in: Boolean(payload.customer?.newsletterOptIn),
          total_amount: totals.total,
          currency: "EUR",
          payment_method: payload.paymentMethod || "cod",
          status: "pending"
        })
        .select("id, order_number, status, created_at")
        .single();

      if (orderError) throw orderError;

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

      await saveNewsletterConsent({
        email: payload.customer?.email || "",
        name: payload.customer?.name || "",
        source: "checkout",
        consent: Boolean(payload.customer?.newsletterOptIn)
      });

      if (payload.paymentMethod === "paypal") {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
        const paypal = await createPayPalOrder({
          orderNumber: order.order_number,
          total: totals.total,
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
        total: totals.total,
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
      const userId = await getCurrentUserId();
      if (!userId) {
        return NextResponse.json({ orders: [] });
      }

      const supabase = createServiceClient();
      const { data, error } = await supabase
        .from("orders")
        .select("order_number,status,tracking_number,created_at,total_amount,payment_method,shipping_address,order_items(product_name,variant_name,engraving_text,engraving_font,engraving_color,quantity,unit_price,preview_url)")
        .eq("user_id", userId)
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
        }))
      });
    } catch (error) {
      return NextResponse.json(
        {
          error: "Could not read orders from Supabase.",
          details: error instanceof Error ? error.message : String(error),
          orders: []
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    orders: memoryOrders
  });
}
