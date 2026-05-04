# ARCHITECTURE — Clawy Tasks

Suggested starting architecture. **Nothing here is final.** Every decision should be re-examined and either ratified or replaced with an ADR in `DOCS/technical-decisions.md` before Phase 1 ends.

## 1. Guiding principles

- **Boring on the inside, sharp on the outside.** Pick stack components used by thousands of teams. Spend the novelty budget on the user experience and domain model.
- **Two layers, not five.** Until the product proves otherwise, a browser and localStorage are enough.
- **One process, one repo.** Do not split into microservices until you have at least one independent deployment cadence reason to do so.
- **Schema first.** The data model is the contract. UI follows.

## 2. Recommended starting stack

> Vite + TypeScript + Tailwind CSS. No backend needed for MVP.

This is a default, not a prescription. Record the actual choice as ADR-001.

## 3. High-level shape

```
┌────────────────────┐
│  Browser (PWA)     │
│  - UI / Components │
│  - State (Zustand) │
│  - Storage (local) │
└────────────────────┘
```

## 4. Module layout

```
src/
  domain/         # Pure types and business rules — no I/O.
    Task.ts       # Task interface, validation, helpers
    Project.ts    # Project interface
  store/          # Zustand stores.
    taskStore.ts  # Task CRUD + filtering
    projectStore.ts # Project CRUD
  components/     # React components.
    TaskList.tsx
    TaskItem.tsx
    TaskForm.tsx
    ProjectList.tsx
    Dashboard.tsx
  hooks/          # Custom hooks.
    useTasks.ts
    useProjects.ts
  utils/          # Helpers.
    storage.ts    # localStorage wrapper
    export.ts     # CSV / JSON export
  App.tsx         # Root component
  main.tsx        # Entry point

tests/
  unit/           # Pure function tests
  integration/    # Component + store tests
```

Rules:
- `domain/` may not import from `store/`, `components/`, or `utils/`.
- `components/` may not import from `utils/` directly — go through `hooks/`.
- A new top-level folder requires an ADR.

## 5. Data model — first cut

Resist the urge to over-normalize. Start with two entities.

| Entity | Fields | Why it exists |
| --- | --- | --- |
| `Task` | id, title, projectId, priority, done, createdAt, completedAt | The thing the daily core action is performed on. |
| `Project` | id, name, color, createdAt | Grouping mechanism for tasks. |

## 6. Performance budget (Phase 4)

Placeholder numbers to be ratified before Phase 4:

- Time to interactive on cold load (4G): **< 2 s**
- Task creation latency: **< 100 ms**
- Render 100 tasks: **< 50 ms**

## 7. Security baseline

- All inputs validated at the component boundary.
- No secrets in committed files.
- HTTPS in any environment that talks to a real user.
- Dependency upgrades reviewed weekly.

## 8. Open questions (to resolve before Phase 1 ends)

- IndexedDB migration path from localStorage?
- Service Worker strategy for offline support?
- Sync strategy if multi-device support is needed later?

Each gets its own ADR. Until then, this document is read as "the current best guess".

_Last edited: 2026-05-04 (initial scaffold)._
