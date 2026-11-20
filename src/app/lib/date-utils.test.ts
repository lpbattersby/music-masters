import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { formatDeadlineDate, formatRelativeTime } from "./date-utils";

it("formats a date-only deadline in the viewer's local calendar date", () => {
  // With no explicit timeZone, the helper uses the viewer's local time. In
  // Node (UTC) that renders the stored date verbatim.
  const formatted = formatDeadlineDate("2025-06-15", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  expect(formatted).toContain("2025");
  expect(formatted).toContain("06");
});

it("respects explicit Intl options when provided", () => {
  // Etc/GMT-9 is a UTC+9 offset zone (note: the sign is inverted in IANA
  // names). We assert year and month, not the day, to stay robust across
  // environments whose Intl data set may vary.
  const formatted = formatDeadlineDate("2025-06-15", {
    timeZone: "Etc/GMT-9",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  expect(formatted).toContain("2025");
  expect(formatted).toContain("06");
});

it("does not shift the date for far-west viewers", () => {
  // A viewer at Etc/GMT+9 (UTC-9) would shift a midnight-UTC instant to the
  // previous day. Our helper must keep the stored date.
  const formatted = formatDeadlineDate("2025-06-15", {
    timeZone: "Etc/GMT+9",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  expect(formatted).toContain("2025");
  expect(formatted).toContain("06");
});

describe("formatRelativeTime", () => {
  beforeEach(() => {
    // Pin the clock to a known UTC instant so assertions are deterministic
    // regardless of the runner's timezone.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders minutes below one hour", () => {
    // 23:30 UTC → 29 min 59 s before end-of-day UTC (23:59:59.999) → "29 minutes".
    vi.setSystemTime(new Date("2025-06-15T23:30:00.000Z"));
    expect(formatRelativeTime("2025-06-15")).toBe("29 minutes");
    // 23:58:30 UTC → 1 min 29 s before end-of-day → "1 minute".
    vi.setSystemTime(new Date("2025-06-15T23:58:30.000Z"));
    expect(formatRelativeTime("2025-06-15")).toBe("1 minute");
  });

  it("renders hours below one day", () => {
    // 20:00 UTC → 3 h 59 m 59 s before end-of-day → rounds to "4 hours".
    vi.setSystemTime(new Date("2025-06-15T20:00:00.000Z"));
    expect(formatRelativeTime("2025-06-15")).toBe("4 hours");
    // 23:00 UTC → 59 min 59 s left → "59 minutes".
    vi.setSystemTime(new Date("2025-06-15T23:00:00.000Z"));
    expect(formatRelativeTime("2025-06-15")).toBe("59 minutes");
    // 22:59:59 UTC → exactly 60 min left → rounds to "1 hour".
    vi.setSystemTime(new Date("2025-06-15T22:59:59.000Z"));
    expect(formatRelativeTime("2025-06-15")).toBe("1 hour");
  });

  it("renders days at one or more full days", () => {
    // From 23:00 UTC on day N, day N+1's end-of-day is ~25 h → "1 day";
    // day N+2's end-of-day is ~49 h → "2 days".
    vi.setSystemTime(new Date("2025-06-15T23:00:00.000Z"));
    expect(formatRelativeTime("2025-06-16")).toBe("1 day");
    expect(formatRelativeTime("2025-06-17")).toBe("2 days");
  });

  it("renders 'under a minute' for an already-passed deadline", () => {
    vi.setSystemTime(new Date("2025-06-16T00:00:00.000Z"));
    expect(formatRelativeTime("2025-06-15")).toBe("under a minute");
  });
});
