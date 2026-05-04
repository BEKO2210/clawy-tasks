# Technical decisions — Clawy Tasks

This file is the project's decision log. It uses the [ADR](https://adr.github.io/) format: short, immutable records of important technical choices.

> Rule: every dependency, every datastore, every framework choice that the project relies on must have an ADR here. If a decision is not recorded, it can be revisited freely. If it is recorded, changing it requires a new ADR that supersedes the previous one.

## How to add an ADR

Copy the template at the bottom of this file. Number sequentially (ADR-001, ADR-002, …). Status is one of `Proposed`, `Accepted`, `Deprecated`, or `Superseded by ADR-XXX`. Never delete an ADR — supersede it.

---

## Decision log

### ADR-001 — Stack: Vite + TypeScript + Tailwind CSS

**Status:** Accepted
**Date:** 2026-05-04
**Decision driver:** What is the fastest, most reliable way to build a PWA with modern tooling?

### Context

We need a frontend stack that:
1. Has a fast dev server for rapid iteration.
2. Provides type safety to catch errors early.
3. Allows utility-first CSS for rapid UI development.
4. Is boring (widely used, well-documented, easy to hire for).

### Options considered

1. **Create React App + JavaScript + CSS Modules** — Familiar but slow, no HMR, CSS Modules add friction.
2. **Next.js + TypeScript + Tailwind** — Great for SSR/SEO, but overkill for a client-side PWA. Adds complexity we don't need yet.
3. **Vite + TypeScript + Tailwind CSS** — Fast HMR, simple config, type-safe, utility-first CSS. Perfect for a PWA.

### Decision

We chose **Vite + TypeScript + Tailwind CSS** because it gives us the fastest feedback loop with the least configuration overhead. Vite's dev server starts in milliseconds. TypeScript catches errors at build time. Tailwind lets us style without leaving the markup.

### Consequences

- Positive: Fast iteration, type safety, minimal config, large community.
- Negative: No SSR (not needed for PWA), Tailwind bundle size (mitigated by purge).
- Reversal cost: Low — Vite is compatible with most React patterns.

### Follow-ups

- Evaluate IndexedDB wrapper (Dexie.js) for Phase 3 offline support.
- Consider PWA manifest and service worker in Phase 1.

---

### ADR template

```markdown
## ADR-NNN — <short title>

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-XXX
**Date:** YYYY-MM-DD
**Decision driver:** <the question we needed to answer>

### Context

<2–4 sentences. What is the situation that forces this decision?>

### Options considered

1. <Option A> — <one-line summary>
2. <Option B> — <one-line summary>
3. <Option C> — <one-line summary>

### Decision

<We chose Option B because …>

### Consequences

- Positive: <…>
- Negative: <…>
- Reversal cost: <Low / Medium / High>

### Follow-ups

- <Concrete next action, with owner and date>
```

_Last edited: 2026-05-04 (initial ADR-001)._
