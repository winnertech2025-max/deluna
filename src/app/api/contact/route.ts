import { NextResponse } from "next/server";
import { contactNotificationEmail, contactReplyEmail, sendTransactionalEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; email?: string; message?: string };
  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
  }

  const contactInbox = process.env.CONTACT_EMAIL || "hello@delunastudio.nl";
  const notification = await sendTransactionalEmail({
    to: contactInbox,
    subject: `New contact request from ${name}`,
    html: contactNotificationEmail({ name, email, body: message })
  });

  if (!notification.sent) {
    return NextResponse.json({ error: "Unable to send contact notification.", notification }, { status: 502 });
  }

  const reply = await sendTransactionalEmail({
    to: email,
    subject: "We received your Deluna Studio request",
    html: contactReplyEmail({ name })
  });

  return NextResponse.json({ notification, reply });
}
