export async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      clientId: process.env.PAYPAL_CLIENT_ID || ""
    })
  };
}