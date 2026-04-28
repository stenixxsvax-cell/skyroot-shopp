export async function handler(event) {
  try {
    const { cartTotal } = JSON.parse(event.body || "{}");

    if (!cartTotal || isNaN(Number(cartTotal)) || Number(cartTotal) <= 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid cart total" }) };
    }

    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
    ).toString("base64");

    const res = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + auth
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "EUR",
            value: Number(cartTotal).toFixed(2)
          }
        }]
      })
    });

    const data = await res.json();
    return { statusCode: res.status, body: JSON.stringify(data) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}