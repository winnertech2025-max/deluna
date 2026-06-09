import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { createServiceClient, hasSupabaseServerConfig } from "@/lib/supabase/service";

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasSupabaseServerConfig()) return new Response("email,name,source,locale,consent_at\n", csvHeaders());

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email,name,source,locale,consent_at")
    .eq("consent", true)
    .order("consent_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = [
    ["email", "name", "source", "locale", "consent_at"].join(","),
    ...(data || []).map((row) => [row.email, row.name, row.source, row.locale, row.consent_at].map(csvCell).join(","))
  ];

  return new Response(`${rows.join("\n")}\n`, csvHeaders());
}

function csvHeaders() {
  return {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="deluna-newsletter-subscribers.csv"`
    }
  };
}

