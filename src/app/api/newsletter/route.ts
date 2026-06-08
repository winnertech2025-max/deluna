import { NextResponse } from "next/server";
import { saveNewsletterConsent } from "@/lib/newsletter";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; name?: string; locale?: string; source?: string };
  const email = String(body.email || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    await saveNewsletterConsent({
      email,
      name: body.name,
      source: body.source || "footer",
      locale: body.locale,
      consent: true
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Could not save newsletter subscription.",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

