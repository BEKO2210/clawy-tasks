# Stripe Account Setup Guide — Clawy Tasks

## Overview
This guide walks through setting up Stripe to accept payments for Clawy Tasks Pro ($5/month).

## Step 1: Create a Stripe Account
1. Go to https://dashboard.stripe.com/register
2. Sign up with your email (or use Stripe Connect with Google/GitHub)
3. Complete business profile:
   - Business type: Individual / Sole proprietorship
   - Business name: Clawy Tasks
   - Website: https://beko2210.github.io/clawy-tasks (or your domain)
   - Industry: Software / SaaS

## Step 2: Verify Your Account
- Upload ID verification (passport or driver's license)
- Add bank account for payouts
- Stripe will review within 1-2 business days

## Step 3: Create Products & Prices
1. In the Stripe Dashboard, go to **Products**
2. Click **Add product**
3. Product name: `Clawy Tasks Pro`
4. Description: `Unlimited projects, cloud sync, advanced analytics, priority support`
5. Pricing model: **Recurring**
6. Price: `$5.00` per month
7. Currency: `USD`
8. Save

## Step 4: Get API Keys
1. Go to **Developers → API keys**
2. Copy your **Publishable key** (pk_test_... for test, pk_live_... for production)
3. Copy your **Secret key** (sk_test_... / sk_live_...)
4. **Never commit the secret key to git**

## Step 5: Create a Checkout Session (Backend)
You'll need a lightweight backend to create Stripe Checkout sessions. Options:

### Option A: Stripe Payment Link (No Code)
1. In Stripe Dashboard, go to your Pro product
2. Click **Create payment link**
3. Copy the generated URL
4. Use this URL directly in your "Upgrade to Pro" button

### Option B: Netlify/Vercel Serverless Function
```javascript
// api/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{
      price: 'price_1234567890', // Your Stripe Price ID
      quantity: 1,
    }],
    success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.origin}/pricing`,
  });
  res.status(200).json({ url: session.url });
};
```

### Option C: Cloudflare Workers
```javascript
export default {
  async fetch(request, env) {
    const stripe = require('stripe')(env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: 'https://yourdomain.com/success',
      cancel_url: 'https://yourdomain.com/pricing',
    });
    return Response.json({ url: session.url });
  }
}
```

## Step 6: Webhook for Subscription Events
Set up a webhook endpoint to handle:
- `checkout.session.completed` → Activate Pro
- `invoice.payment_succeeded` → Renew Pro
- `invoice.payment_failed` → Downgrade to Free
- `customer.subscription.deleted` → Downgrade to Free

Webhook endpoint should verify the signature:
```javascript
const sig = request.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
```

## Step 7: Test Mode
1. Use test API keys (pk_test_..., sk_test_...)
2. Test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`
3. Any future expiry date, any CVC, any ZIP

## Step 8: Go Live
1. Switch to live API keys
2. Update payment link or backend
3. Add Stripe branding to your checkout page
4. Monitor first transactions in Dashboard

## Revenue Projection
- 100 users @ $5/mo = $500/mo = $6,000/yr
- 500 users @ $5/mo = $2,500/mo = $30,000/yr
- 1,000 users @ $5/mo = $5,000/mo = $60,000/yr

Stripe fees: 2.9% + $0.30 per transaction.
On $5: $0.145 + $0.30 = $0.445 fee. Net: $4.555 per subscription.

## Files to Update
- `landing/index.html` — Replace placeholder with real Stripe Payment Link or Checkout integration
- Add environment variables (never commit secrets):
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PRICE_ID`
  - `STRIPE_WEBHOOK_SECRET`

## Next Steps
1. [ ] Create Stripe account
2. [ ] Set up test product & price
3. [ ] Generate Payment Link (easiest) or build backend
4. [ ] Test checkout flow with test card
5. [ ] Switch to live mode
6. [ ] Monitor subscriptions in Dashboard
