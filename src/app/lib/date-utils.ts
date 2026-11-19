/**
 * Format a deadline date (`YYYY-MM-DD`) for display in the viewer's local
 * timezone. Deadlines are stored and compared as UTC dates, but a user who is
 * ahead of UTC would otherwise see a deadline date one day "in the future"
 * for a round that has already started. We only use the calendar date part of
 * the stored value, so the rendered string always matches the deadline date
 * the user sees in the form (which is also a date-only input).
 */
export function formatDeadlineDate(
  date: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const [year, month, day] = date.split("-").map(Number);
  // Use local-time construction so we don't shift the calendar date by the
  // viewer's offset. The date is already UTC-only (no time component).
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString(
    undefined,
    options ?? { year: "numeric", month: "long", day: "numeric" },
  );
}

/**
 * Formats the time remaining until a date-only deadline as a short relative
 * label: minutes (< 1 h), hours (< 24 h), or days (>= 24 h).
 *
 * The deadline is treated as inclusive through the end of that UTC day, so we
 * measure to the end of the deadline day in the viewer's local time — not to
 * local midnight — otherwise a user at 23:00 would see "1 day" with ~1 h left.
 * Uses local calendar dates (same approach as `formatDeadlineDate`) so the
 * countdown stays consistent with the rendered date across timezones.
 *
 * Returns a string like "45 minutes", "3 hours", or "2 days". For deadlines
 * that are already past, returns "under a minute" so the UI still renders
 * something meaningful while the server hasn't advanced the round state yet.
 */
export function formatRelativeTime(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const deadlineEnd = new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
  const remainingMs = Math.max(0, deadlineEnd - Date.now());
  const minutes = Math.floor(remainingMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "under a minute";
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  return `${days} ${days === 1 ? "day" : "days"}`;
}
