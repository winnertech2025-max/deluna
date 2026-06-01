import { NextResponse } from "next/server";
import { getSupabaseStatus } from "@/lib/supabase/status";

export async function GET() {
  return NextResponse.json(getSupabaseStatus());
}
