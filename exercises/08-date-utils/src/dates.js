// All functions work in UTC so results don't depend on the machine's timezone.

function isLeapYear(y) {
  return y % 4 === 0;
}

// Adds n months; if the day doesn't exist in the target month, clamp to its last day.
function addMonths(date, n) {
  const d = new Date(date);
  d.setUTCMonth(d.getUTCMonth() + n);
  return d;
}

// Whole days from a to b (b - a), ignoring time-of-day.
function daysBetween(a, b) {
  return Math.round((b - a) / 86400000);
}

// Monday 00:00 UTC of the week containing `date`.
function startOfWeek(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d;
}

// 'YYYY-MM-DD'
function formatDate(date) {
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
}

// Count of Mon–Fri days in [start, end) (end exclusive, start inclusive).
function businessDaysBetween(start, end) {
  throw new Error('not implemented');
}

module.exports = { isLeapYear, addMonths, daysBetween, startOfWeek, formatDate, businessDaysBetween };
