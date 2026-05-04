# ACCEPTANCE CRITERIA — Clawy Tasks

Concrete, checkable statements of "done" for each phase in `ROADMAP.md`. A phase is complete only when every box in its section is checked.

> Rule: If a feature is not listed here, it is not in scope. To add scope, edit `MASTERPLAN.md` and `ROADMAP.md`, then add a checklist here in the same commit.

---

## Phase 0 — Foundation

### Stack & tooling
- [x] Stack decision recorded as ADR-001 in `DOCS/technical-decisions.md`.
- [x] `README.md` "Quick start" runs end-to-end on a clean machine.
- [x] `npm test` exists and passes — even if it only asserts `true`.
- [ ] CI pipeline runs lint + tests on every push.

### Hygiene
- [x] `.gitignore` excludes secrets, build artifacts, and editor noise.
- [x] No committed credentials, API keys, or `.env` files.
- [x] License chosen (MIT).

---

## Phase 1 — MVP / Daily core action

### Functional
- [ ] One end-to-end flow exists: a user can create, complete, and delete a task.
- [ ] Data persists across browser restarts (localStorage).
- [ ] At least one automated test per critical path.

### Quality
- [ ] No unhandled errors on the happy path.
- [ ] Error states are visible to the user.
- [ ] Code passes the project linter without warnings.

### Dogfooding
- [ ] You (the maintainer) used the product for the daily core action for 5 consecutive working days without falling back to a previous tool.

---

## Phase 2 — Validation

### Onboarding
- [ ] First-run experience works without manual intervention.
- [ ] A new user reaches the daily core action in < 3 minutes.

### Feedback
- [ ] Activation metric is instrumented and visible.
- [ ] At least one feedback channel is active.

### External validation
- [ ] ≥ 3 external users have completed activation.
- [ ] ≥ 2 of them have stated they would continue using it.

---

## Phase 3 — Visibility & Retention

### Functional
- [ ] The single dashboard view from `MASTERPLAN.md` is shipped.
- [ ] Data export works (CSV at minimum).
- [ ] Reminders / notifications exist (opt-in, dismissible).

### Metrics
- [ ] Retention metric is instrumented; week-4 retention is computable.
- [ ] Time-to-first-action for returning users is measurable.

---

## Phase 4 — Sustainable scale

### Performance
- [ ] Performance budget is defined in `ARCHITECTURE.md`.
- [ ] Budget is enforced in CI or via a manual pre-release check.

### Operability
- [ ] One-page runbook exists for the three most likely incidents.
- [ ] Errors are observable (logging, error tracker, or equivalent).
- [ ] Backups / data export verified by an actual restore test.

### Public surface
- [ ] Public landing page exists.
- [ ] A stranger has installed it unaided and reached activation within 24 hours.

---

## Cross-cutting (every phase)

- [x] `RUN_LOG.md` has an entry for every working session.
- [ ] No `TODO` comments older than the previous phase without an open issue.
- [ ] No dead code paths or orphaned files.
- [ ] Every new dependency is justified in `DOCS/technical-decisions.md`.

_Last edited: 2026-05-04 (initial scaffold)._
