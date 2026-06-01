import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { orderStatusEmail, sendTransactionalEmail } from "@/lib/email";
import { products } from "@/lib/products";
import { createServiceClient, hasSupabaseServerConfig } from "@/lib/supabase/service";

const orders = [
  {
    id: "DLN-10293014",
    customer: "Chau Pham",
    email: "chau@globalbeautysupplier.nl",
    total: 33.8,
    status: "in_production",
    paymentMethod: "paypal",
    trackingNumber: null,
    address: "Amsterdam, Netherlands",
    createdAt: new Date().toISOString(),
    phone: "+31 6 12345678",
    items: [
      {
        name: "Engraved Heart Bracelet",
        variant: "Standard",
        engravingText: "Chau",
        engravingFont: "Script",
        engravingColor: "Champagne Gold",
        quantity: 1,
        unitPrice: 16.9,
        image: products[0].image,
        previewUrl: null
      },
      {
        name: "Custom Cosmetic Pouch",
        variant: "Classic",
        engravingText: "Luna",
        engravingFont: "Serif",
        engravingColor: "Soft Black",
        quantity: 1,
        unitPrice: 11.6,
        image: products[4].image,
        previewUrl: null
      }
    ]
  },
  {
    id: "DLN-10283197",
    customer: "Guest checkout",
    email: "guest@example.com",
    total: 14.8,
    status: "shipped",
    paymentMethod: "cod",
    trackingNumber: "DLV-2026-001",
    address: "Rotterdam, Netherlands",
    createdAt: new Date().toISOString(),
    phone: "+31 6 87654321",
    items: [
      {
        name: "Personalized Tote Bag",
        variant: "Large",
        engravingText: "Mila",
        engravingFont: "Modern",
        engravingColor: "Ivory",
        quantity: 1,
        unitPrice: 14.8,
        image: products[3].image,
        previewUrl: null
      }
    ]
  }
];

function getProductImage(productName: string) {
  return products.find((product) => product.name.toLowerCase() === productName.toLowerCase())?.image || products[0].image;
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (hasSupabaseServerConfig()) {
    try {
      const supabase = createServiceClient();
      const { data, error } = await supabase
        .from("orders")
        .select("id,order_number,customer_name,customer_email,customer_phone,shipping_address,total_amount,status,payment_method,tracking_number,created_at,order_items(product_name,variant_name,engraving_text,engraving_font,engraving_color,quantity,unit_price,preview_url)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json({
        orders: (data || []).map((order) => ({
          dbId: order.id,
          id: order.order_number,
          customer: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          total: Number(order.total_amount),
          status: order.status,
          trackingNumber: order.tracking_number,
          paymentMethod: order.payment_method,
          address: order.shipping_address,
          createdAt: order.created_at,
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
          orders
        },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ orders });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { id: string; status: string; trackingNumber?: string };
  if (hasSupabaseServerConfig()) {
    try {
      const supabase = createServiceClient();
      const { data, error } = await supabase
        .from("orders")
        .update({
          status: body.status,
          tracking_number: body.status === "shipping" ? body.trackingNumber || null : undefined
        })
        .eq("order_number", body.id)
        .select("order_number,status,tracking_number,customer_email")
        .single();
      if (error) throw error;

      await sendTransactionalEmail({
        to: data.customer_email,
        subject: `Deluna order ${data.order_number}: ${data.status.replaceAll("_", " ")}`,
        html: orderStatusEmail({
          orderNumber: data.order_number,
          status: data.status,
          trackingNumber: data.tracking_number
        })
      });

      return NextResponse.json({ order: data });
    } catch (error) {
      return NextResponse.json(
        {
          error: "Could not update order in Supabase.",
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
  }
  const order = orders.find((item) => item.id === body.id);
  if (order) {
    order.status = body.status;
    order.trackingNumber = body.status === "shipping" ? body.trackingNumber || null : order.trackingNumber;
  }
  return NextResponse.json({ order });
}
