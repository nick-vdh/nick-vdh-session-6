# Data Model: Support for Overdue Todo Items

No stored data or API schema changes. Overdue is a derived state of the existing Todo.

## Todo (existing, unchanged)

| Field | Type | Notes |
|-------|------|-------|
| `id` | number | Unique identifier |
| `title` | string | Required, max 255 characters |
| `dueDate` | string or null | Optional, `YYYY-MM-DD` (day granularity) |
| `completed` | number (0 or 1) | 1 means complete |
| `createdAt` | string | ISO timestamp; list stays newest-first |

## Derived state: Overdue

`isOverdue(todo, today)` is true if and only if all of the following hold:

1. `todo.completed` is falsy (incomplete).
2. `todo.dueDate` normalizes to a valid calendar date `YYYY-MM-DD`.
3. The normalized due date is strictly earlier than `today` (the local `YYYY-MM-DD`).

| completed | dueDate | vs. today | Overdue |
|-----------|---------|-----------|---------|
| 0 | past | earlier | yes |
| 0 | today | equal | no |
| 0 | future | later | no |
| 0 | null, empty, or invalid | n/a | no |
| 1 | any | any | no |

### Normalization rules

- Accept `YYYY-MM-DD`, or a longer ISO string whose first 10 characters are `YYYY-MM-DD`.
- Reject values that do not match the pattern or are not real calendar dates
  (for example `2025-02-30`); treat them as no due date.

## Transient state

| Name | Owner | Description |
|------|-------|-------------|
| `today` | `useToday()` hook in `App` | Current local date `YYYY-MM-DD`; updated at local midnight and on tab visibility |

### State transitions

- Complete toggle (`completed` 0 to 1): overdue becomes false. 1 to 0 with past due date: true.
- Due date edit to today or later: false. Edit to a past date while incomplete: true.
- Local day rolls over: `today` changes, so todos due the previous day become overdue.
