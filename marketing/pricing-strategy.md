# Pricing Strategy — Clawy Tasks

## Philosophy

**Free tier is the marketing.** Pro tier is the revenue.  
We optimize for activation, not immediate monetization.

## Tiers

### Free — $0/month
**Target:** 90% of users  
**Goal:** Word-of-mouth, activation, retention

- Unlimited tasks
- Unlimited projects
- Offline storage (localStorage)
- Data export (JSON/CSV)
- PWA install
- Basic dashboard

**Why free?** We want every solopreneur to try it. No friction, no credit card, no "trial anxiety".

### Pro — $5/month
**Target:** 10% of users  
**Goal:** Revenue from power users

Everything in Free, plus:
- Cloud sync across devices (Supabase)
- Team collaboration (up to 5 members)
- Advanced analytics (trends, productivity scores)
- Priority email support
- Custom themes

**Why $5?** It's a coffee. Less than Todoist ($5). Less than Things 3 ($10). More than free tools that die.

## Conversion Strategy

### Month 1-3: Free Only
- Build user base
- Collect feedback
- Iterate on features

### Month 4: Pro Launch
- Email all active users
- Offer 50% discount for first year ($30/year)
- Limited time: "Founder's pricing"

### Month 6+: Optimize
- A/B test pricing page
- Test annual vs monthly
- Add referral program (1 month free for both)

## Revenue Projections

**Conservative:**
- 1,000 active users by month 6
- 5% conversion to Pro = 50 Pro users
- 50 × $5 = $250 MRR

**Optimistic:**
- 5,000 active users by month 6
- 10% conversion = 500 Pro users
- 500 × $5 = $2,500 MRR

**Dream:**
- 10,000 active users by month 12
- 10% conversion = 1,000 Pro users
- 1,000 × $5 = $5,000 MRR

## Payment Processing

**Primary:** Stripe  
- Easy setup
- Good developer experience
- Supports subscriptions

**Alternative:** Lemon Squeezy  
- Merchant of record (handles VAT)
- Good for EU founders

**Setup:**
1. Create Stripe account
2. Set up subscription product ($5/month)
3. Add Stripe Checkout to app
4. Webhook to activate Pro features

## Launch Pricing

**Founder's Deal (first 100 Pro users):**
- $30/year (50% off)
- Lifetime price lock
- "Founder" badge

**Why?** Early adopters become evangelists. Reward them.

---

*Strategy document. Update monthly based on actual data.*
