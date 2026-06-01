type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

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
  return `
    <div style="font-family:Arial,sans-serif;color:#171411">
      <h1>Your Deluna order is confirmed</h1>
      <p>Thank you for your order <strong>${order.orderNumber}</strong>.</p>
      <p>Total: <strong>€${order.total.toFixed(2)}</strong></p>
      <h3>Personalized items</h3>
      <ul>${order.items.map((item) => `<li>${item}</li>`).join("")}</ul>
      <p>We will notify you whenever your order status changes.</p>
    </div>
  `;
}

export function orderStatusEmail(order: { orderNumber: string; status: string; trackingNumber?: string | null }) {
  const tracking = order.trackingNumber
    ? `<p>Tracking number: <strong>${order.trackingNumber}</strong></p>`
    : "";
  return `
    <div style="font-family:Arial,sans-serif;color:#171411">
      <h1>Your Deluna order status changed</h1>
      <p>Order <strong>${order.orderNumber}</strong> is now: <strong>${order.status.replaceAll("_", " ")}</strong>.</p>
      ${tracking}
      <p>Thank you for choosing Deluna Studio.</p>
    </div>
  `;
}
