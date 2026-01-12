import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";

/**
 * Get the number of days in a given month.
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get month label (e.g., "January 2026").
 */
export function getMonthLabel(year: number, month: number): string {
  const date = new Date(year, month, 1);
  return format(date, "MMMM yyyy");
}

/**
 * Get all day numbers for a month (1..28/29/30/31).
 */
export function getDaysOfMonth(year: number, month: number): number[] {
  const start = startOfMonth(new Date(year, month, 1));
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end });
  return days.map((d) => d.getDate());
}

/**
 * Format a date as YYYY-MM-DD.
 */
export function formatDateKey(
  year: number,
  month: number,
  day: number
): string {
  const date = new Date(year, month, day);
  const yyyy = date.getFullYear().toString().padStart(4, "0");
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Get current year and month.
 */
export function getCurrentMonthInfo(): { year: number; month: number } {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth(),
  };
}
