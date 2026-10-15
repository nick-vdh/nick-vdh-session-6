---

description: "Task list for Support for Overdue Todo Items"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md, quickstart.md

**Tests**: Required (FR-010, constitution principles III and IV). Within each phase, write tests first and confirm they fail before implementing.

**Organization**: Tasks are grouped by user story. All changes are frontend-only under `packages/frontend/src/`; the backend is unchanged.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1, US2, US3)
- Test clock is always mocked (`jest.useFakeTimers()` / `jest.setSystemTime()`); never depend on the real date

## Phase 1: Setup

**Purpose**: Confirm a clean baseline and create the new folder

- [X] T001 Run `npm test` and `npx eslint src` in `packages/frontend` to confirm a green baseline before changes
- [X] T002 Create the `packages/frontend/src/utils/` and `packages/frontend/src/utils/__tests__/` directories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Pure date logic, midnight hook, and theme tokens that every user story depends on

**CRITICAL**: No user story work can begin until this phase is complete

### Tests (write first, must fail)

- [X] T003 [P] Write unit tests for `getLocalDateString` (local date formatting, zero-padding, default `now`), `isOverdue` (past, today, future, no/empty/invalid due date such as `2025-02-30`, completed with past date, ISO timestamp due date using first 10 chars, never throws) and `msUntilNextLocalMidnight` (always > 0, exact value near midnight) in `packages/frontend/src/utils/__tests__/dateUtils.test.js`
- [X] T004 [P] Write hook tests for `useToday` with fake timers: returns the current local date, updates after advancing past local midnight, re-checks on `visibilitychange`, clears timer and listener on unmount, in `packages/frontend/src/utils/__tests__/useToday.test.js`

### Implementation

- [X] T005 [P] Implement `getLocalDateString`, `isOverdue` and `msUntilNextLocalMidnight` with string-based `YYYY-MM-DD` comparison and calendar-date validation per data-model.md, with JSDoc, in `packages/frontend/src/utils/dateUtils.js`
- [X] T006 Implement the `useToday()` hook (state holds today's local date; `setTimeout` for next local midnight plus small buffer then reschedule; `visibilitychange` re-check; cleanup on unmount) in `packages/frontend/src/utils/useToday.js` (depends on T005)
- [X] T007 [P] Add `--overdue-color` (light `#b71c1c`, dark `#ff8a80`) and `--overdue-bg` (subtle tint on each theme's surface) tokens to both the light and dark palettes in `packages/frontend/src/styles/theme.css`

**Checkpoint**: `dateUtils` and `useToday` tests pass; tokens exist in both themes

---

## Phase 3: User Story 1 - Spot Overdue Todos at a Glance (Priority: P1) MVP

**Goal**: Incomplete todos with a due date before today show a distinct style and an "Overdue" text label.

**Independent Test**: Render a list with one past-due, one due-today, one future, one undated, and one completed past-due todo; only the incomplete past-due todo shows the label and `overdue` class.

### Tests for User Story 1 (write first, must fail)

- [X] T008 [P] [US1] Add `TodoCard` tests with a fixed `today` prop: past-due incomplete shows `.overdue` class and `.overdue-label` text "Overdue"; due today, future, no due date, invalid date, and completed past-due show neither; default `today` works when prop omitted (mock system time); edit mode unchanged, in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [X] T009 [P] [US1] Add a `TodoList` test verifying the `today` prop is forwarded to each `TodoCard` (only the past-due card shows "Overdue") and list order is unchanged, in `packages/frontend/src/components/__tests__/TodoList.test.js`

### Implementation for User Story 1

- [X] T010 [US1] In `packages/frontend/src/components/TodoCard.js`, accept `today` prop (default `getLocalDateString()`), compute `isOverdue(todo, today)`, add `overdue` class to the root `todo-card` in view mode, and render `<span className="overdue-label">Overdue</span>` after the formatted date inside `.todo-due-date`
- [X] T011 [US1] In `packages/frontend/src/components/TodoList.js`, accept a `today` prop and forward it unchanged to each `TodoCard`
- [X] T012 [US1] Add `.todo-card.overdue` (left border using `--overdue-color`, background `--overdue-bg`) and `.overdue-label` (bold text in `--overdue-color`, 8px spacing grid) styles using theme variables only in `packages/frontend/src/App.css`

**Checkpoint**: User Story 1 is fully functional and testable on its own (MVP)

---

## Phase 4: User Story 2 - Overdue Status Follows Todo Changes (Priority: P2)

**Goal**: The indicator updates on complete/un-complete/edit and automatically at local midnight.

**Independent Test**: Toggle and edit an overdue todo and confirm the label disappears and returns; advance the fake clock past local midnight and confirm a todo due the previous day becomes overdue without reload.

### Tests for User Story 2 (write first, must fail)

- [X] T013 [US2] Add `App` integration tests (mocked `todoService`, fixed system time): completing an overdue todo removes the label; un-completing a past-due todo restores it; editing due date to today/future removes it; editing a non-overdue todo to a past date adds it, in `packages/frontend/src/__tests__/App.test.js`
- [X] T014 [US2] Add an `App` test with `jest.useFakeTimers()` and `jest.setSystemTime()` confirming a todo due today becomes "Overdue" after advancing past local midnight with no user action, in `packages/frontend/src/__tests__/App.test.js` (same file as T013; run after it)

### Implementation for User Story 2

- [X] T015 [US2] In `packages/frontend/src/App.js`, call `useToday()` once and pass `today` to `TodoList`

**Checkpoint**: User Stories 1 and 2 both work; midnight rollover verified

---

## Phase 5: User Story 3 - Accessible and Theme-Consistent (Priority: P3)

**Goal**: Indicator is legible in both themes, meets WCAG AA contrast, and is exposed as real text.

**Independent Test**: View an overdue todo in light and dark modes; label is readable and exists as DOM text.

### Tests for User Story 3 (write first)

- [X] T016 [US3] Add a `TodoCard` test asserting the overdue status is available as text via `getByText('Overdue')` (not only color) and the label is not hidden from assistive technology, in `packages/frontend/src/components/__tests__/TodoCard.test.js` (same file as T008; run after it)

### Implementation for User Story 3

- [X] T017 [US3] Verify `--overdue-color` on `--overdue-bg` and on the card surface meets 4.5:1 contrast in both themes and adjust token values in `packages/frontend/src/styles/theme.css` if needed; confirm no hard-coded colors were added in `packages/frontend/src/App.css`

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T018 Run `npm test -- --coverage --watchAll=false` in `packages/frontend`; confirm package coverage is at least 80% and `dateUtils.js`, `useToday.js` and the overdue paths in `TodoCard.js`, `TodoList.js`, `App.js` are fully covered; add missing tests
- [X] T019 Run `npx eslint src` in `packages/frontend` and fix all errors and warnings (import order, 2-space indent, lines under 100 characters)
- [ ] T020 Run the manual validation steps in `specs/001-overdue-todos/quickstart.md` (yesterday/today/tomorrow/none, toggle, edit, light/dark, DevTools text check, midnight rollover)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none
- **Foundational (Phase 2)**: depends on Setup; blocks all user stories
- **US1 (Phase 3)**: depends on Foundational (needs `isOverdue`, `getLocalDateString`, tokens)
- **US2 (Phase 4)**: depends on Foundational (`useToday`) and US1 (`TodoList` `today` prop, `TodoCard` display)
- **US3 (Phase 5)**: depends on US1 (label and styles) and T007
- **Polish (Phase 6)**: depends on all user stories

### Within Each Story

- Tests first and failing, then implementation
- T005 before T006; T010 and T011 before T015

### Parallel Opportunities

- T003 and T004 in parallel; T005 and T007 in parallel with each other (T005 also parallel with T003/T004 only after tests are written)
- T008 and T009 in parallel
- T013, T014 and T016 touch files shared with other tasks in the same file; do not run in parallel with those

## Parallel Example: Foundational

```text
Task: "Write dateUtils tests in packages/frontend/src/utils/__tests__/dateUtils.test.js"
Task: "Write useToday tests in packages/frontend/src/utils/__tests__/useToday.test.js"
Task: "Add overdue theme tokens in packages/frontend/src/styles/theme.css"
```

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 Setup, Phase 2 Foundational
2. Phase 3 User Story 1
3. Stop and validate: only incomplete past-due todos show "Overdue"

### Incremental Delivery

1. Foundation ready, then US1 (MVP)
2. Add US2 (live updates and midnight rollover)
3. Add US3 (accessibility and contrast verification)
4. Polish: coverage, lint, quickstart

## Notes

- No backend, API, or schema changes; no new dependencies
- No filtering, sorting, reminders, or notifications (FR-009)
- Commit after each task or logical group using conventional prefixes (`feat:`, `test:`)

## Phase 7: Convergence

- [X] T021 Make `formatDate` in `packages/frontend/src/components/TodoCard.js` build the displayed due date from the `YYYY-MM-DD` parts (not `new Date(str)` UTC parsing), and add a `TodoCard` test run under a negative-offset timezone showing the displayed date matches the overdue comparison per FR-001 and US1 (partial)
- [X] T022 Review the `data-testid="todo-card"` attribute added to `packages/frontend/src/components/TodoCard.js`; justify keeping it or replace it with a role- or text-based assertion in `TodoCard.test.js` and `TodoList.test.js` per plan: Source Code structure (unrequested) Kept: the class is the visual distinction and ESLint forbids DOM queries in tests.
