type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendTransactionalEmail(payload: EmailPayload) {
  if (!payload.to) return { sent: false, reason: "missing_recipient" };

  if (process.env.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Deluna Studio <orders@deluna.local>",
        to: payload.to,
        subject: payload.subject,
        html: payload.html
      })
    });

    if (!response.ok) {
      return { sent: false, reason: await response.text() };
    }
    return { sent: true };
  }

  console.info("[Deluna email preview]", payload);
  return { sent: false, reason: "RESEND_API_KEY not configured" };
}

export function orderCreatedEmail(order: { orderNumber: string; total: number; items: string[] }) {
  const orderNumber = escapeHtml(order.orderNumber);
  return `
    <div style="font-family:Arial,sans-serif;color:#171411">
      <h1>Your Deluna order is confirmed</h1>
      <p>Thank you for your order <strong>${orderNumber}</strong>.</p>
      <p>Total: <strong>€${order.total.toFixed(2)}</strong></p>
      <h3>Personalized items</h3>
      <ul>${order.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <p>We will notify you whenever your order status changes.</p>
    </div>
  `;
}

export function orderStatusEmail(order: { orderNumber: string; status: string; trackingNumber?: string | null }) {
  const tracking = order.trackingNumber
    ? `<p>Tracking number: <strong>${escapeHtml(order.trackingNumber)}</strong></p>`
    : "";
  const orderNumber = escapeHtml(order.orderNumber);
  const status = escapeHtml(order.status.replaceAll("_", " "));
  return `
    <div style="font-family:Arial,sans-serif;color:#171411">
      <h1>Your Deluna order status changed</h1>
      <p>Order <strong>${orderNumber}</strong> is now: <strong>${status}</strong>.</p>
      ${tracking}
      <p>Thank you for choosing Deluna Studio.</p>
    </div>
  `;
}

export function welcomeAccountEmail(customer: { name?: string; email: string }) {
  const name = escapeHtml(customer.name || customer.email.split("@")[0]);
  return `
    <div style="font-family:Arial,sans-serif;color:#171411;line-height:1.6">
      <h1 style="margin:0 0 12px;color:#171411">Welcome to Deluna Studio</h1>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your Deluna account has been created successfully.</p>
      <p>You can now save your profile details, view your order history, and create personalized products more easily.</p>
      <p style="margin-top:24px">Choose it. Personalize it. Make it yours.</p>
    </div>
  `;
}

export function contactNotificationEmail(message: { name: string; email: string; body: string }) {
  const name = escapeHtml(message.name);
  const email = escapeHtml(message.email);
  const body = escapeHtml(message.body);
  return `
    <div style="font-family:Arial,sans-serif;color:#171411;line-height:1.6">
      <h1 style="margin:0 0 12px;color:#171411">New Deluna contact request</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <h3>Message</h3>
      <p style="white-space:pre-wrap">${body}</p>
    </div>
  `;
}

export function contactReplyEmail(message: { name: string }) {
  const name = escapeHtml(message.name);
  return `
    <div style="font-family:Arial,sans-serif;color:#171411;line-height:1.6">
      <h1 style="margin:0 0 12px;color:#171411">We received your message</h1>
      <p>Hi <strong>${message.name}</strong>,</p>
      <p>Thank you for contacting Deluna Studio. We have received your message and will get back to you as soon as possible.</p>
      <p>If your request is about a custom product, please keep any reference images or order details ready so we can help faster.</p>
      <p style="margin-top:24px">Deluna Studio</p>
    </div>
  `;
}
