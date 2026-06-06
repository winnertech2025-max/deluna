type PayPalLink = {
  href: string;
  rel: string;
};

type PayPalOrderResponse = {
  id: string;
  status: string;
  links?: PayPalLink[];
};

type PayPalCaptureResponse = {
  id: string;
  status: string;
};

function paypalBaseUrl() {
  return process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export function hasPayPalConfig() {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

async function getPayPalAccessToken() {
  if (!hasPayPalConfig()) {
    throw new Error("PayPal credentials are not configured.");
  }

  const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  if (!response.ok) {
    throw new Error(`Could not get PayPal access token: ${await response.text()}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("PayPal access token was not returned.");
  return data.access_token;
}

export async function createPayPalOrder(order: {
  orderNumber: string;
  total: number;
  currency?: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}) {
  const token = await getPayPalAccessToken();
  const response = await fetch(`${paypalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `${order.orderNumber}-${Date.now()}`
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order.orderNumber,
          custom_id: order.orderNumber,
          invoice_id: order.orderNumber,
          description: order.description.slice(0, 127),
          amount: {
            currency_code: order.currency || "EUR",
            value: order.total.toFixed(2)
          }
        }
      ],
      application_context: {
        brand_name: "Deluna Studio",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
        return_url: order.returnUrl,
        cancel_url: order.cancelUrl
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Could not create PayPal order: ${await response.text()}`);
  }

  const data = (await response.json()) as PayPalOrderResponse;
  const approvalUrl = data.links?.find((link) => link.rel === "approve")?.href;
  if (!approvalUrl) throw new Error("PayPal approval URL was not returned.");

  return {
    paypalOrderId: data.id,
    approvalUrl
  };
}

export async function capturePayPalOrder(paypalOrderId: string) {
  const token = await getPayPalAccessToken();
  const response = await fetch(`${paypalBaseUrl()}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Could not capture PayPal order: ${await response.text()}`);
  }

  return (await response.json()) as PayPalCaptureResponse;
}
