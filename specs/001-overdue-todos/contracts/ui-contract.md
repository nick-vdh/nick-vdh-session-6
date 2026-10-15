# UI and Module Contract: Overdue Todos

No HTTP endpoints are added or changed. The contracts below are the internal module and UI
interfaces this feature exposes.

## Module: `src/utils/dateUtils.js`

| Function | Signature | Behavior |
|----------|-----------|----------|
| `getLocalDateString` | `(now?: Date) => string` | Returns local `YYYY-MM-DD` for `now` (default current time) |
| `isOverdue` | `(todo: {completed, dueDate}, today: string) => boolean` | Rules in [data-model.md](../data-model.md); never throws on missing or invalid `dueDate` |
| `msUntilNextLocalMidnight` | `(now?: Date) => number` | Milliseconds from `now` until the next local 00:00:00; always greater than 0 |

## Hook: `src/utils/useToday.js`

`useToday() => string`

- Returns the current local date `YYYY-MM-DD`.
- Re-renders the consumer when the local date changes (timer at next local midnight, and
  re-check when the document becomes visible).
- Cleans up timer and listener on unmount.

## Component props

| Component | New prop | Type | Default | Behavior |
|-----------|----------|------|---------|----------|
| `TodoList` | `today` | string | undefined | Forwarded unchanged to each `TodoCard` |
| `TodoCard` | `today` | string | `getLocalDateString()` | Used with `isOverdue` to decide the overdue display |

## Rendered output (TodoCard, view mode)

When `isOverdue(todo, today)` is true:

- Root element has classes `todo-card overdue` (plus `completed` never applies, since overdue
  requires incomplete).
- Inside `.todo-due-date`, after the formatted date, a `<span class="overdue-label">Overdue</span>`
  with visible text "Overdue".

When false: no `overdue` class and no `.overdue-label` element.

Edit mode is unchanged.

## Theme tokens (`src/styles/theme.css`)

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--overdue-color` | `#b71c1c` | `#ff8a80` | Label text and card left border |
| `--overdue-bg` | subtle tint of the color on `--bg-surface` | subtle tint on dark surface | Card background tint |

Both text colors must keep contrast of at least 4.5:1 against their card background.
