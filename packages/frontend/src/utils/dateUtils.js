const DUE_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/;

/**
 * Formats a date as the local calendar date.
 * @param {Date} [now] - Date to format; defaults to the current time.
 * @returns {string} Local date as `YYYY-MM-DD`.
 */
export function getLocalDateString(now = new Date()) {
  const year = String(now.getFullYear()).padStart(4, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Normalizes a stored due date to `YYYY-MM-DD`.
 * @param {*} value - Raw `dueDate` value.
 * @returns {string|null} Normalized date, or null if missing or not a real calendar date.
 */
function normalizeDueDate(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const match = DUE_DATE_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  // UTC avoids DST shifts; round-tripping rejects dates like 2025-02-30.
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  const isRealDate =
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(day);

  return isRealDate ? `${year}-${month}-${day}` : null;
}

/**
 * Determines whether a todo is overdue: incomplete with a due date before today.
 * @param {{completed: number|boolean, dueDate: string|null}} todo - Todo to check.
 * @param {string} today - Local date as `YYYY-MM-DD`.
 * @returns {boolean} True when the todo is overdue. Never throws on bad input.
 */
export function isOverdue(todo, today) {
  if (!todo || todo.completed || typeof today !== 'string') {
    return false;
  }

  const dueDate = normalizeDueDate(todo.dueDate);
  // Fixed-width ISO dates sort correctly as strings, which avoids time zone parsing issues.
  return dueDate !== null && dueDate < today;
}

/**
 * Milliseconds until the next local midnight.
 * @param {Date} [now] - Reference time; defaults to the current time.
 * @returns {number} Always greater than 0.
 */
export function msUntilNextLocalMidnight(now = new Date()) {
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return nextMidnight.getTime() - now.getTime();
}
