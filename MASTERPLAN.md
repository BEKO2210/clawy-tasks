# MASTERPLAN — Clawy Tasks

> Single source of truth. If anything in the repo contradicts this file, this file wins.

## 1. Vision

A focused task management tool that helps **solopreneurs and indie hackers** manage their daily work without friction, without bloat, and without ceremony. Built for deep work, not busy work.

## 2. The problem we're solving

Today, solopreneurs rely on a patchwork of tools: Todoist, Notion, spreadsheets, sticky notes. The result is wasted time, scattered focus, and tasks that fall through the cracks.

Concretely, three pains we believe matter most:

1. **Friction** — too many steps to capture a task.
2. **Context switching** — tasks are isolated from projects and goals.
3. **No offline support** — cloud-only tools fail when connectivity is poor.

## 3. The solution in one paragraph

A PWA that captures tasks in seconds, organizes them by project and priority, works offline by default, and exports data on demand. Opinionated where opinions help, minimal where they must be.

## 4. Core principles

1. **Boring tech, sharp product.** Vite + TypeScript + Tailwind. Spend novelty budget on UX.
2. **Ship vertical slices.** Each release is a thin, end-to-end usable feature.
3. **Optimize for legibility.** A new contributor should understand the codebase in under 30 minutes.
4. **Default to fewer features.** Adding is easy; subtracting is hard.
5. **Real users from week one.** Synthetic data is for tests, not for product decisions.

## 5. Scope

### In scope (initial release)

- Task creation, editing, completion, deletion.
- Project-based organization.
- Priority levels (High / Medium / Low).
- Offline storage (localStorage → IndexedDB).
- Data export (JSON / CSV).
- PWA installability.

### Out of scope (until proven necessary)

- Collaboration / multi-user.
- Recurring tasks.
- Time tracking.
- Integrations (calendar, Slack, etc.).
- Mobile-native apps.

## 6. Success metrics

1. **Activation** — % of new users who create their first task within 24 hours.
2. **Retention** — % of activated users still active in week 4.
3. **Word-of-mouth** — % of new users who arrive via existing-user referral.

Targets for the first 90 days:
- Activation ≥ 50%.
- Week-4 retention ≥ 25%.
- Referral share ≥ 20% by day 90.

## 7. Non-goals

- Becoming a horizontal platform for everyone.
- Matching the feature surface of Todoist or Notion.
- Premature monetization complexity.

## 8. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| We build the wrong task model | Medium | High | 5 user interviews before week 2. |
| Scope creep from enthusiastic users | High | Medium | Hard enforcement of `ACCEPTANCE_CRITERIA.md`. |
| Stack choice locks us in | Low | Medium | Boring, swappable components. |

## 9. Open questions

- What is the single most important "daily core action" for solopreneurs?
- Where do they currently track tasks, and what would make them switch?
- What's the smallest piece of data we need to make their task view useful?

## 10. How this document changes

- Edits to this file require a `RUN_LOG.md` entry.
- Major changes require an ADR in `DOCS/technical-decisions.md`.
- Minor edits can be made directly with a one-line note in `RUN_LOG.md`.
