# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-10-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

## Summary

Show incomplete todos whose due date is before the user's local calendar day with a distinct
style and a text "Overdue" label. Overdue is a derived, frontend-only state (no API, storage,
or schema change). A pure date utility decides overdue status, a small hook supplies the
current local date and re-renders at local midnight, and `TodoCard` renders the indicator
using new theme tokens that stay legible in light and dark modes.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18.2, Node.js 16+

**Primary Dependencies**: React, react-scripts 5.0.1 (existing); no new dependencies

**Storage**: N/A (overdue is derived from existing `completed` and `dueDate` fields)

**Testing**: Jest + `@testing-library/react` via `react-scripts test`; Jest fake timers for
midnight rollover

**Target Platform**: Desktop web browsers (single-column UI, max 600px)

**Project Type**: Web application (npm workspaces: `packages/frontend`, `packages/backend`)

**Performance Goals**: Indicator updates within 1s of a todo change and within 1 minute of
local midnight (SC-003); one timer for the whole list

**Constraints**: Day-granularity comparison in local time; WCAG AA contrast in both themes;
theme variables only (no hard-coded colors in components); no filtering/sorting/reminders

**Scale/Scope**: Up to ~50 todos in one list; 1 new utility module, 1 hook, 3 edited components,
CSS tokens and rules

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality & Simplicity | PASS | Pure `isOverdue` function reused by the card; single timer hook; no duplication |
| II. Consistent Style & Structure | PASS | New files in `src/utils/`; camelCase/PascalCase naming; imports ordered |
| III. Test-First Development | PASS | Tests written before/alongside each unit (see quickstart and tasks) |
| IV. Comprehensive, Isolated Testing | PASS | Colocated `__tests__/`; fake timers mock the clock; >=80% coverage, 100% on overdue workflow |
| V. Consistent, Accessible UI | PASS | Theme variables, text label plus color, real DOM text, AA contrast tokens per theme |
| VI. Scope Discipline & Persistence | PASS | No filtering/sorting/reminders; no backend or schema change; list order unchanged |

**Post-design re-check**: PASS. Design adds no dependencies, no API surface, and no stored data.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Created by /speckit-tasks (not by this command)
```

### Source Code (repository root)

```text
packages/frontend/src/
├── App.js                         # edit: call useToday(), pass `today` to TodoList
├── App.css                        # edit: .todo-card.overdue, .overdue-label styles
├── styles/theme.css               # edit: --overdue-color / --overdue-bg tokens per theme
├── components/
│   ├── TodoList.js                # edit: forward `today` prop
│   ├── TodoCard.js                # edit: compute isOverdue, render label and class
│   └── __tests__/
│       ├── TodoCard.test.js       # edit: overdue display tests
│       └── TodoList.test.js       # edit: overdue forwarding test
├── utils/
│   ├── dateUtils.js               # new: getLocalDateString, isOverdue, msUntilNextLocalMidnight
│   ├── useToday.js                # new: hook, re-renders at local midnight
│   └── __tests__/
│       ├── dateUtils.test.js      # new
│       └── useToday.test.js       # new
└── __tests__/
    └── App.test.js                # edit: update-after-change and midnight rollover tests

packages/backend/                  # unchanged
```

**Structure Decision**: Frontend-only change within the existing `packages/frontend/src/`
layout. The constitution places shared logic in `utils/`, so both the pure date logic and the
hook live there. The backend is untouched because overdue is derived from existing fields.

## Complexity Tracking

No constitution violations; nothing to justify.
