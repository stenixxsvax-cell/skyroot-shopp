async function paypalRefund(captureId, auth) {
  const res = await fetch(`https://api-m.sandbox.paypal.com/v2/payments/captures/${captureId}/refund`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + auth
    },
    body: "{}"
  });
  return await res.json();
}

export async function handler(event) {
  try {
    const { orderID, expectedTotal, minecraftNick, customerEmail, orderSummary } = JSON.parse(event.body || "{}");

    if (!orderID) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing orderID" }) };
    }

    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
    ).toString("base64");

    const res = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + auth
      }
    });

    const data = await res.json();

    const capture = data?.purchase_units?.[0]?.payments?.captures?.[0];
    const capturedValue = capture?.amount?.value;
    const captureId = capture?.id;

    if (expectedTotal && capturedValue && Number(capturedValue).toFixed(2) !== Number(expectedTotal).toFixed(2)) {
      let refund = null;
      if (captureId) refund = await paypalRefund(captureId, auth);

      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Payment amount mismatch. Payment was not confirmed and refund was requested.",
          expectedTotal: Number(expectedTotal).toFixed(2),
          capturedValue: Number(capturedValue).toFixed(2),
          refund
        })
      };
    }

    // TODO next step: send emails to customer and skyrootsmp@gmail.com.
    // Need email provider credentials (Resend/SendGrid/Gmail OAuth).

    return {
      statusCode: res.status,
      body: JSON.stringify({
        ok: true,
        minecraftNick,
        customerEmail,
        orderSummary,
        paypal: data
      })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}