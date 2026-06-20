type MollieLink = {
  href: string;
  type?: string;
};

type MolliePayment = {
  id: string;
  status: string;
  amount?: {
    currency: string;
    value: string;
  };
  metadata?: {
    orderNumber?: string;
  };
  _links?: {
    checkout?: MollieLink;
  };
};

const MOLLIE_API_URL = "https://api.mollie.com/v2";

export function hasMollieConfig() {
  return Boolean(process.env.MOLLIE_API_KEY);
}

function getMollieApiKey() {
  if (!hasMollieConfig()) {
    throw new Error("MOLLIE_API_KEY is not configured.");
  }
  return process.env.MOLLIE_API_KEY!;
}

async function mollieRequest<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${MOLLIE_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getMollieApiKey()}`,
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(`Mollie API error ${response.status}: ${await response.text()}`);
  }

  return (await response.json()) as T;
}

export async function createMolliePayment(order: {
  orderNumber: string;
  total: number;
  currency?: string;
  description: string;
  redirectUrl: string;
  webhookUrl: string;
}) {
  const payment = await mollieRequest<MolliePayment>("/payments", {
    method: "POST",
    body: JSON.stringify({
      amount: {
        currency: order.currency || "EUR",
        value: order.total.toFixed(2)
      },
      description: order.description.slice(0, 255),
      redirectUrl: order.redirectUrl,
      webhookUrl: order.webhookUrl,
      metadata: {
        orderNumber: order.orderNumber
      }
    })
  });

  const checkoutUrl = payment._links?.checkout?.href;
  if (!checkoutUrl) throw new Error("Mollie checkout URL was not returned.");

  return {
    molliePaymentId: payment.id,
    checkoutUrl
  };
}

export async function getMolliePayment(paymentId: string) {
  return mollieRequest<MolliePayment>(`/payments/${encodeURIComponent(paymentId)}`);
}

export function isMolliePaid(status: string) {
  return status === "paid";
}

export function isMollieFinalFailed(status: string) {
  return ["canceled", "expired", "failed"].includes(status);
}
