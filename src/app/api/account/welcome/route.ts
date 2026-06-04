import { NextResponse } from "next/server";
import { sendTransactionalEmail, welcomeAccountEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; email?: string };
  const email = body.email?.trim();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const result = await sendTransactionalEmail({
    to: email,
    subject: "Welcome to Deluna Studio",
    html: welcomeAccountEmail({ name: body.name?.trim(), email })
  });

  return NextResponse.json(result);
}
