# Research: Support for Overdue Todo Items

All Technical Context items were resolvable from the repository; no NEEDS CLARIFICATION remain.

## 1. Where to compute overdue status

- **Decision**: Compute in the frontend as a pure function `isOverdue(todo, today)` in
  `src/utils/dateUtils.js`; do not store or return it from the API.
- **Rationale**: Spec says overdue is derived (FR-008) and the constitution forbids schema
  changes beyond basic todo storage. A server-computed flag would use the server's timezone,
  while the spec requires the user's local date, and would go stale at midnight.
- **Alternatives considered**: Backend `overdue` field (wrong timezone, stale, API change);
  inline logic in `TodoCard` (not reusable, harder to unit test).

## 2. Date comparison approach

- **Decision**: Compare `YYYY-MM-DD` strings. `getLocalDateString(now)` builds today's local
  date from `getFullYear/getMonth/getDate`; a todo is overdue when its normalized due date is
  lexicographically less than today. The due date is normalized from the first 10 characters
  and validated as a real calendar date; otherwise it is treated as no due date.
- **Rationale**: Due dates are day-granularity strings from `<input type="date">`. String
  comparison avoids `new Date('YYYY-MM-DD')` parsing as UTC, which is off by one day in
  negative-offset timezones. Fixed-width ISO dates sort correctly.
- **Alternatives considered**: `Date` object comparison with time zeroing (timezone pitfalls);
  a date library such as date-fns (new dependency for trivial logic).

## 3. Midnight rollover (FR-005a)

- **Decision**: A `useToday()` hook holds today's local date in state and schedules a
  `setTimeout` for the next local midnight (plus a small buffer), then recomputes and
  reschedules. It clears the timer on unmount. `App` calls it once and passes `today` down.
- **Rationale**: One timer for the whole list, precise, and within SC-003 (1 minute). Timers
  are easy to test with Jest fake timers (constitution requires mocking timers).
- **Alternatives considered**: Per-card `setInterval` polling (many timers, wasteful);
  one app-level `setInterval` every minute (simpler but less precise and constant wakeups);
  `visibilitychange` only (does not cover a visible, open tab). Browsers throttle timers in
  background tabs, so the hook also re-checks the date on `visibilitychange`, which keeps the
  indicator accurate when the user returns.

## 4. Passing the current day to cards

- **Decision**: `App` passes `today` to `TodoList`, which forwards it to `TodoCard`. `TodoCard`
  defaults `today` to `getLocalDateString()` when omitted so existing usages and tests keep
  working.
- **Rationale**: Keeps the card a pure function of its props (deterministic tests) and makes a
  midnight change re-render all cards through normal React props flow.
- **Alternatives considered**: React context (extra indirection for one value); each card
  calling `new Date()` on render (does not re-render at midnight by itself).

## 5. Visual and accessible design

- **Decision**: Add `--overdue-color` and `--overdue-bg` tokens to both theme palettes. Overdue
  cards get an `overdue` class (colored left border and subtle background tint) and the due
  date line gains a visible "Overdue" text label (`<span className="overdue-label">`). The
  label text is real DOM text, so screen readers announce it; no color-only signal.
- **Rationale**: Existing `--danger-color` in dark mode (`#ef5350` on `#2d2d2d`, about 3.8:1)
  falls below WCAG AA (4.5:1) for 12px text, so dedicated tokens are used: light `#b71c1c`
  and dark `#ff8a80` (both above 4.5:1 on their surfaces). Constitution requires theme
  variables rather than hard-coded colors and AA contrast.
- **Alternatives considered**: Reusing `--danger-color` (insufficient dark-mode contrast);
  icon-only indicator (violates FR-004); `aria-label` only (not visible).

## 6. Testing strategy

- **Decision**: Unit tests for `isOverdue`, `getLocalDateString`, `msUntilNextLocalMidnight`;
  hook tests with `jest.useFakeTimers()` and `jest.setSystemTime()`; component tests for
  `TodoCard`/`TodoList` display; `App` integration tests for toggle and edit updates and
  midnight rollover. The clock is always mocked so tests do not depend on the real date.
- **Rationale**: Satisfies FR-010, the constitution's isolation rule, and the 80% coverage
  target with 100% on this workflow.
- **Alternatives considered**: Relying on far-past/far-future dates only (does not cover
  today boundary or rollover).
