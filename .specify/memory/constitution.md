<!--
Sync Impact Report
- Version change: (unfilled template) → 1.0.0
- Modified principles: none renamed (initial adoption; all placeholders replaced)
- Added sections: Core Principles I–VI, Technology & Scope Constraints,
  Development Workflow & Quality Gates, Governance
- Removed sections: none
- Follow-up TODOs: none
- Templates reviewed: plan-template.md, spec-template.md, tasks-template.md read the
  constitution at runtime; not modified by this command.
- Source documents: docs/coding-guidelines.md, docs/testing-guidelines.md,
  docs/ui-guidelines.md, docs/functional-requirements.md, docs/project-overview.md
-->

# Todo App Constitution

## Core Principles

### I. Code Quality & Simplicity
All code MUST follow DRY, KISS, and SOLID. Each module, component, or function MUST have a
single responsibility. Common logic MUST be extracted into shared utilities or reusable
components rather than duplicated. Simple, readable solutions MUST be preferred over clever
ones, and optimization MUST NOT precede a demonstrated need. Comments MUST explain "why", not
"what"; public functions and components SHOULD carry JSDoc.

Rationale: a small starter app stays maintainable only if complexity is kept in check.

### II. Consistent Style & Structure
- Indentation is 2 spaces, LF line endings, no trailing whitespace, lines ideally under 100
  characters.
- Naming: `camelCase` for variables and functions, `UPPER_SNAKE_CASE` for constants,
  `PascalCase` for React components and classes; component file names MUST match the
  component name.
- Imports MUST be ordered: external libraries, internal modules (relative paths), then
  styles, with a blank line between groups. Circular dependencies are prohibited.
- ESLint errors and warnings MUST be resolved before a pull request is opened.
- Frontend code lives under `packages/frontend/src/` (components, services, utils) and
  backend code under `packages/backend/src/` (routes, controllers, services, middleware).

Rationale: uniform conventions reduce review friction and cognitive load.

### III. Test-First Development (NON-NEGOTIABLE)
Tests MUST be written before or alongside implementation, following Red-Green-Refactor.
Bug fixes MUST begin with a failing test that reproduces the bug. Tests MUST verify
behavior, not implementation details, use descriptive names, and follow Arrange-Act-Assert.

Rationale: tests document expected behavior and prevent regressions during refactoring.

### IV. Comprehensive, Isolated Testing
- Overall coverage MUST be at least 80% per package; critical user workflows MUST have 100%
  coverage.
- Unit and integration tests are required. End-to-end tests are out of scope until
  explicitly added.
- Tests use Jest (and `@testing-library/react` for the frontend) and MUST be colocated in
  `__tests__/` directories as `{filename}.test.js`.
- Each test MUST be independent, own its setup and cleanup, share no state, and mock
  external dependencies (API calls, timers). Shared fixtures belong in `__mocks__/` or
  `fixtures/`.
- All tests MUST pass locally before committing and before a pull request is created.

Rationale: isolated, high-coverage tests keep the suite fast, trustworthy, and non-brittle.

### V. Consistent, Accessible UI
The UI MUST follow `docs/ui-guidelines.md`: Material Design-inspired, Halloween-themed,
single-column layout (max width 600px), 8px spacing grid, and the defined light and dark
color palettes using theme variables rather than hard-coded colors. Dark/light mode MUST
default to the system preference and persist the user's choice in `localStorage`.
Deleting a todo MUST require a confirmation dialog. All interactive elements MUST be
keyboard accessible, form inputs MUST have associated labels, icon buttons MUST have
descriptive `aria-label`s or titles, and color contrast MUST meet WCAG AA. Motion MUST be
minimal.

Rationale: a coherent, accessible interface is a core product requirement.

### VI. Scope Discipline & Reliable Persistence
Features MUST stay within `docs/functional-requirements.md`: create, view (newest first),
toggle complete, edit, and delete todos, with title (required, max 255 characters) and an
optional due date. Out-of-scope items (authentication, multi-user, priorities, categories,
recurring todos, reminders, undo/redo, bulk operations, search, filtering) MUST NOT be added
without a constitution-compliant spec change. Every todo change MUST be persisted
immediately through the Express.js backend API. Errors MUST be handled gracefully with
meaningful messages and user-visible feedback, and input MUST be validated at API
boundaries.

Rationale: a narrow, well-defined scope keeps the app simple and deliverable.

## Technology & Scope Constraints

- Monorepo using npm workspaces: `packages/frontend` (React) and `packages/backend`
  (Node.js/Express REST API).
- Node.js v16+ and npm v7+ are the supported baseline.
- Styling uses CSS; Jest is the testing framework for both packages.
- Single-user application; todos are stored globally with no user identification.
- No database schema changes beyond basic todo storage.
- Performance: avoid unnecessary renders (`useMemo`/`useCallback` where appropriate) and
  keep bundle size reasonable.

## Development Workflow & Quality Gates

- Work happens on feature branches (e.g., `feature/todo-editing`) and merges via pull
  requests with code review.
- Commits MUST be atomic with clear messages explaining the "why" (conventional prefixes such
  as `feat:`, `fix:`, `docs:` are RECOMMENDED).
- Before a pull request: linting is clean, all tests pass, coverage meets the 80% target,
  and new behavior is covered by tests.
- Reviewers MUST verify compliance with this constitution; any deviation MUST be justified
  in the pull request description.

## Governance

This constitution supersedes other practices where they conflict. The documents in `docs/`
(coding, testing, UI, and functional requirements) are the detailed runtime guidance and
MUST remain consistent with it.

- **Amendments**: proposed via pull request that updates this file, includes a Sync Impact
  Report, and is approved by a reviewer. Changes affecting dependent specs, plans, or tasks
  MUST include a migration note.
- **Versioning** (semantic): MAJOR for backward-incompatible principle removals or
  redefinitions; MINOR for new principles or materially expanded guidance; PATCH for
  clarifications and wording fixes.
- **Compliance review**: every pull request and Spec Kit plan MUST be checked against these
  principles; unjustified complexity or violations block merging.

**Version**: 1.0.0 | **Ratified**: 2026-10-15 | **Last Amended**: 2026-10-15
