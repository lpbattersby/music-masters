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
 * Deadlines are stored as UTC dates (`YYYY-MM-DD`) and are inclusive through
 * the end of that UTC day, so we measure to 23:59:59.999 **UTC** on the
 * deadline day. This keeps the countdown consistent regardless of the
 * viewer's local timezone.
 *
 * Returns a string like "45 minutes", "3 hours", or "2 days".
 *
 * The countdown always rounds **up** (ceiling) so a user never sees less time
 * than is actually left (e.g. 59 m 59 s renders as "1 hour", and a sub-minute
 * remainder renders as "1 minute"). For an already-passed deadline the
 * remaining time clamps to zero and renders "0 minutes".
 */
export function formatRelativeTime(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const deadlineEnd = Date.UTC(year, month - 1, day, 23, 59, 59, 999);
  const remainingMs = Math.max(0, deadlineEnd - Date.now());
  const minutes = Math.ceil(remainingMs / 60_000);
  const hours = Math.ceil(remainingMs / 3_600_000);
  const days = Math.ceil(remainingMs / 86_400_000);

  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  return `${days} ${days === 1 ? "day" : "days"}`;
}
