# RUN_LOG — Clawy Tasks

Append-only journal of every working session. Newest entry on top. Never delete entries; correct them with a follow-up entry instead.

## Entry template

```
## Run #NNN — YYYY-MM-DD — <one-line summary>

**Phase:** Phase X — <name>
**Duration:** ~Xh
**Goal going in:** <what you set out to do>

**What changed**
- <files / behaviours>

**What works now**
- <observable outcomes>

**What's still broken or missing**
- <known gaps>

**Decisions**
- <link to ADRs in DOCS/technical-decisions.md if any>

**Next session starts with**
- <a single concrete action>
```

---

## Run #002 — 2026-05-04 — Hello-world scaffold and first push

**Phase:** Phase 0 — Foundation
**Duration:** ~1h
**Goal going in:** Scaffold the smallest possible "hello world" using the chosen stack.

**What changed**
- Vite project scaffolded with TypeScript and Tailwind CSS.
- React app with task management UI: add, complete, delete tasks.
- Zustand store with localStorage persistence.
- Domain model: Task.ts with validation and helpers.
- Test suite: Vitest with 6 tests for Task domain.
- PWA manifest added.
- All planning documents committed.
- First push to GitHub: https://github.com/BEKO2210/clawy-tasks

**What works now**
- `npm install` + `npm run dev` boots the app locally.
- `npm test` passes all 6 tests.
- Tasks persist across browser restarts via localStorage.
- UI is responsive and functional.

**What's still broken or missing**
- No CI pipeline yet.
- No linting configured.
- No service worker for offline support.
- No data export feature.

**Decisions**
- ADR-001 ratified: Vite + TypeScript + Tailwind is working well.

**Next session starts with**
- Set up GitHub Actions CI pipeline (lint + test).
- Add ESLint and Prettier configuration.
- Add service worker for offline support.
