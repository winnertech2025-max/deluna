import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { createServiceClient, hasSupabaseServerConfig } from "@/lib/supabase/service";

type CustomerAggregate = {
  name: string;
  email: string;
  phone: string | null;
  address: string;
  orderCount: number;
  deliveredRevenue: number;
  lastOrderAt: string | null;
  statuses: string[];
};

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasSupabaseServerConfig()) return NextResponse.json({ customers: [] });

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("orders")
      .select("customer_name,customer_email,customer_phone,shipping_address,total_amount,status,created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;

    const map = new Map<string, CustomerAggregate>();

    for (const order of data || []) {
      const email = order.customer_email || "guest@example.com";
      const current: CustomerAggregate = map.get(email) || {
        name: order.customer_name || "Guest",
        email,
        phone: order.customer_phone,
        address: order.shipping_address || "",
        orderCount: 0,
        deliveredRevenue: 0,
        lastOrderAt: order.created_at,
        statuses: []
      };
      current.orderCount += 1;
      current.phone ||= order.customer_phone;
      current.address ||= order.shipping_address || "";
      current.lastOrderAt ||= order.created_at;
      current.statuses.push(order.status || "pending");
      if (order.status === "delivered") current.deliveredRevenue += Number(order.total_amount || 0);
      map.set(email, current);
    }

    return NextResponse.json({ customers: Array.from(map.values()) });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not load customers.", details: error instanceof Error ? error.message : String(error), customers: [] },
      { status: 500 }
    );
  }
}
