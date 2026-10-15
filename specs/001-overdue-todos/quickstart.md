# Quickstart: Validating Overdue Todos

## Prerequisites

- Node.js 16+ and npm 7+; dependencies installed with `npm install` at the repo root.

## Automated validation

```bash
cd packages/frontend
npm test
```

Expected: all suites pass, including the new `dateUtils`, `useToday`, `TodoCard`, `TodoList`,
and `App` overdue tests; package coverage is at least 80% with the overdue code fully covered.
Tests mock the clock, so results do not depend on the real date.

Lint check (must be clean):

```bash
cd packages/frontend
npx eslint src
```

## Manual validation

Start the app (see the root README for the exact scripts), then:

1. Create todos due yesterday, today, tomorrow, and with no due date.
   Expected: only the "yesterday" todo shows the red "Overdue" label and tinted card
   ([FR-001](spec.md), [FR-003](spec.md), [FR-004](spec.md)).
2. Mark the overdue todo complete. Expected: the label disappears immediately; un-complete it
   and the label returns ([US2](spec.md)).
3. Edit the overdue todo's due date to a future date, then back to a past date.
   Expected: label hides, then shows.
4. Toggle light and dark mode. Expected: the label and card remain clearly legible in both
   ([US3](spec.md)).
5. Inspect the label in DevTools or a screen reader. Expected: "Overdue" exists as real text.
6. Midnight rollover: with a todo due today, change the system clock to just before midnight
   (or in DevTools run a clock override) and let midnight pass with the tab open.
   Expected: the todo shows "Overdue" within 1 minute without reload ([FR-005a](spec.md)).

## References

- Module and UI interfaces: [contracts/ui-contract.md](contracts/ui-contract.md)
- Overdue rules and state transitions: [data-model.md](data-model.md)
