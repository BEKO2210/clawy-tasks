# Pricing Strategy — Clawy Tasks

## Philosophy
<<<<<<< HEAD

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
=======
**Value-first, friction-free.** The free tier must be genuinely useful — not a crippled demo. Pro should feel like a natural upgrade for power users, not a paywall for basic functionality.

## Target Audience
- Solo founders & indie hackers
- Freelancers managing multiple clients
- Side-project builders who need lightweight organization
- People who hate bloated project management tools

## Pricing Tiers

### Free — $0/month
**Goal:** Viral growth, word-of-mouth, zero barrier to entry.

- Unlimited tasks
- Up to 3 projects
- Priority levels (high/medium/low)
- Due dates
- JSON/CSV export
- Dashboard view
- Offline PWA
- localStorage persistence

**Why 3 projects?** Enough for personal + 2 client projects. Forces upgrade only when genuinely scaling.

### Pro — $5/month
**Goal:** Sustainable revenue from power users.

Everything in Free, plus:
- Unlimited projects
- Cloud sync across devices
- Advanced analytics (trends, velocity, burndown)
- Priority email support
- Early access to new features
- Custom themes

**Why $5?** 
- Below psychological threshold of "real money" ($10+)
- Comparable to a coffee — easy to justify
- 10x cheaper than competitors (Todoist $4/mo, Notion $8/mo, Asana $10.99/mo)
- At 200 Pro users = $1,000 MRR = sustainable solo income

## Competitor Analysis
| Tool | Free Tier | Paid | Notes |
|------|-----------|------|-------|
| Todoist | Limited | $4/mo | Complex, feature-heavy |
| Notion | Unlimited | $8/mo | General docs, not task-focused |
| Trello | Limited | $5/mo | Kanban-only, slow |
| Asana | Limited | $10.99/mo | Team-focused, overkill for solo |
| Things 3 | None | $50 one-time | Mac only, no sync |
| Clawy Tasks | Generous | $5/mo | **Offline-first, simple, fast** |

## Positioning
**"The task manager that respects your time and your data."**

- No account required for free tier
- No cloud dependency
- No feature bloat
- Export anytime — your data is yours

## Launch Pricing
- **Early adopters (first 100 Pro users):** $3/month forever (grandfathered)
- **Launch price:** $5/month
- **Future price:** $5/month (stable — no surprise hikes)

## Revenue Model
- Primary: Pro subscriptions ($5/mo)
- Future: One-time lifetime deal ($49) for risk-averse users
- Future: Team plan ($10/user/mo) if multi-user demand emerges

## Conversion Strategy
1. **In-app upgrade nudges:** When user hits 3 projects, show gentle "Need more projects?"
2. **Dashboard CTA:** Pro analytics teaser in free dashboard
3. **Email drip:** After 7 days of active use, send value proposition
4. **Social proof:** "Join 200+ Pro users shipping faster"

## Metrics to Track
- Free → Pro conversion rate (target: 5-10%)
- Monthly churn (target: < 5%)
- Lifetime value (target: $60+ = 12+ months)
- CAC (target: < $10 via organic/SEO)

## Decision Log
- **2026-05-04:** Chose $5/mo for Pro. Rationale: undercuts all competitors while remaining sustainable at low volume.
- **2026-05-04:** Free tier includes unlimited tasks. Rationale: task volume isn't the cost driver — project organization is.
- **2026-05-04:** No lifetime deal at launch. Rationale: recurring revenue is healthier for a solo builder.
>>>>>>> cb4ad00 (fix: relative paths for GitHub Pages, micro-animations, active-press, hover-lift)
