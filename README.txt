SkyRootSMP PayPal Buttons Project

Upload this project folder/ZIP to Netlify.

Required Netlify Environment Variables:
- PAYPAL_CLIENT_ID
- PAYPAL_SECRET

This version uses PAYPAL SANDBOX:
- https://api-m.sandbox.paypal.com

What is included:
- PayPal Checkout button
- backend create-order function
- backend capture-order function
- amount verification
- automatic refund request if the captured amount does not match expected amount
- Google Pay / Apple Pay placeholders through PayPal SDK; they only appear if PayPal/device/browser/account supports them

Next step for emails:
Use an email provider like Resend, SendGrid, or Gmail OAuth.