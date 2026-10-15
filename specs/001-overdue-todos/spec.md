# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items — as a todo application user, I want to easily identify and distinguish overdue tasks in my todo list so that I can prioritize my work and quickly see which tasks are past their due date. The feature must include automated tests covering the overdue determination logic and its display."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Spot Overdue Todos at a Glance (Priority: P1)

A user opens their todo list and immediately sees which incomplete todos have a due date earlier than today. Overdue todos look visibly different from other todos and carry a clear textual "Overdue" indication, so the user does not need to compare dates manually.

**Why this priority**: This is the core value of the feature; without a visible overdue indication, nothing else matters.

**Independent Test**: Create one todo with a due date in the past and one with a due date in the future, then view the list. Only the past-due incomplete todo shows the overdue indication.

**Acceptance Scenarios**:

1. **Given** an incomplete todo with a due date earlier than today, **When** the user views the todo list, **Then** the todo is displayed with a distinct overdue appearance and an "Overdue" label.
2. **Given** an incomplete todo with a due date of today, **When** the user views the todo list, **Then** the todo is NOT marked overdue.
3. **Given** an incomplete todo with a due date in the future, **When** the user views the todo list, **Then** the todo is NOT marked overdue.
4. **Given** an incomplete todo with no due date, **When** the user views the todo list, **Then** the todo is NOT marked overdue.

---

### User Story 2 - Overdue Status Follows Todo Changes (Priority: P2)

A user changes a todo and the overdue indication updates immediately to reflect the new state: completing an overdue todo removes the overdue indication, un-completing a past-due todo restores it, and editing the due date to a future date (or a past date) updates it accordingly.

**Why this priority**: The indication is only trustworthy if it stays accurate as the user manages their todos.

**Independent Test**: Take an overdue todo, mark it complete, and confirm the indication disappears; mark it incomplete again and confirm it returns; change its due date to a future date and confirm it disappears.

**Acceptance Scenarios**:

1. **Given** an overdue todo, **When** the user marks it complete, **Then** the overdue indication is removed.
2. **Given** a completed todo whose due date is in the past, **When** the user marks it incomplete, **Then** the overdue indication appears.
3. **Given** an overdue todo, **When** the user edits its due date to today or a future date, **Then** the overdue indication is removed.
4. **Given** a non-overdue todo, **When** the user edits its due date to a past date, **Then** the overdue indication appears.

---

### User Story 3 - Overdue Indication Is Accessible and Theme-Consistent (Priority: P3)

The overdue indication is conveyed through more than color alone (a text label), remains legible in both light and dark modes, and is announced meaningfully to assistive technologies.

**Why this priority**: Ensures the feature is usable by everyone and consistent with the existing look and feel, but the feature still delivers value without refinement.

**Independent Test**: View an overdue todo in light and dark modes and confirm the indication is readable in both and its meaning is available as text.

**Acceptance Scenarios**:

1. **Given** an overdue todo, **When** the user switches between light and dark modes, **Then** the overdue indication remains clearly visible and meets accessible contrast expectations.
2. **Given** an overdue todo, **When** the list is read by assistive technology, **Then** the overdue status is available as text, not only as color.

---

### Edge Cases

- A todo due today is not overdue until the day has passed (the due date is compared by calendar day, not time of day).
- A completed todo is never shown as overdue, regardless of due date.
- A todo with no due date is never overdue.
- A todo with a missing or invalid due date value is treated as having no due date and is not shown as overdue.
- If the user keeps the application open across midnight, a todo due "yesterday" becomes overdue once the day rolls over, no later than the next refresh of the list.
- Overdue determination uses the user's local calendar date.
- A list containing only overdue todos, or none, displays correctly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST classify a todo as overdue if and only if it is incomplete, has a due date, and that due date is earlier than the current local calendar date.
- **FR-002**: The system MUST NOT classify a todo as overdue when it is completed, has no due date, or is due today or later.
- **FR-003**: The system MUST display overdue todos with a visually distinct appearance compared to non-overdue todos in the todo list.
- **FR-004**: The system MUST show a text label ("Overdue") on each overdue todo so the status is not conveyed by color alone.
- **FR-005**: The overdue indication MUST update immediately when a todo is completed, un-completed, or has its due date edited.
- **FR-006**: The overdue indication MUST remain legible and consistent with the application's visual theme in both light and dark modes.
- **FR-007**: The overdue status MUST be available to assistive technologies as text.
- **FR-008**: The overdue determination MUST be derived from existing todo data (completion status and due date); it MUST NOT require users to enter additional information.
- **FR-009**: The feature MUST NOT introduce filtering, sorting by overdue, reminders, or notifications; the existing newest-first ordering of the list is unchanged.
- **FR-010**: The feature MUST be covered by automated tests that verify the overdue determination rules (past, today, future, no due date, completed, invalid date) and the display of the overdue indication (shown for overdue todos, absent otherwise, updated after changes).

### Key Entities

- **Todo**: A task with a title, an optional due date, and a completion status. "Overdue" is a derived state (incomplete and due date before today), not a stored attribute.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify every overdue todo in a list of up to 50 todos in under 5 seconds without comparing dates manually.
- **SC-002**: 100% of incomplete todos with a past due date show the overdue indication, and 0% of completed, undated, due-today, or future-dated todos show it.
- **SC-003**: The overdue indication updates within 1 second of the user completing, un-completing, or editing a todo.
- **SC-004**: The overdue indication is distinguishable by users who cannot perceive color differences, because a text label is always present.
- **SC-005**: Automated tests covering the overdue rules and display pass, and the new behavior meets the project's required test coverage.

## Assumptions

- "Overdue" means the due date is strictly before today's date in the user's local time zone; a todo due today is not overdue.
- Only the due date (day granularity) is tracked; there is no time-of-day on due dates.
- The existing todo data already contains the completion status and optional due date, so no new data needs to be stored.
- The overdue state is computed when the list is displayed and refreshed on todo changes; real-time live updates at midnight are not required.
- The existing theme palettes will be used for the overdue styling.
- Out of scope: overdue filtering or sorting, reminders/notifications, priority levels, and mobile-specific optimization (consistent with the project's functional requirements).
