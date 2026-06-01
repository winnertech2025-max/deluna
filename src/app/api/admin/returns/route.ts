import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { createServiceClient, hasSupabaseServerConfig } from "@/lib/supabase/service";

const fallbackReturns: unknown[] = [];

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasSupabaseServerConfig()) return NextResponse.json({ returns: fallbackReturns });

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("returned_orders")
      .select("id,order_number,customer_email,reason,condition,status,refund_amount,notes,created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ returns: data || [] });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not load returned orders.", details: error instanceof Error ? error.message : String(error), returns: fallbackReturns },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (!hasSupabaseServerConfig()) {
    fallbackReturns.unshift({ id: Date.now().toString(), ...body, created_at: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("returned_orders")
      .insert({
        order_number: body.orderNumber,
        customer_email: body.customerEmail,
        reason: body.reason,
        condition: body.condition,
        status: body.status || "received",
        refund_amount: Number(body.refundAmount || 0),
        notes: body.notes || ""
      })
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json({ returnOrder: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not create returned order.", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (!hasSupabaseServerConfig()) return NextResponse.json({ ok: true });

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("returned_orders")
      .update({ status: body.status, notes: body.notes })
      .eq("id", body.id)
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json({ returnOrder: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not update returned order.", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
