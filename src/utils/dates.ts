import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";

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
  day: number,
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

/**
 * Parse a month string (yyyy-MM-01) into year and month.
 */
export function parseMonthString(monthStr: string): {
  year: number;
  month: number;
} {
  const date = startOfMonth(new Date(monthStr));
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
  };
}

export function monthStringToDate(monthStr: string): Date {
  return startOfMonth(new Date(monthStr));
}

export function monthDateToString(date: Date): string {
  return format(startOfMonth(date), "yyyy-MM-01");
}

/**
 * Format year and month as yyyy-MM-01 string.
 */
export function formatMonthString(year: number, month: number): string {
  const date = new Date(year, month, 1);
  return format(date, "yyyy-MM-01");
}

/**
 * Get the previous month.
 */
export function getPreviousMonth(
  year: number,
  month: number,
): { year: number; month: number } {
  const date = subMonths(new Date(year, month, 1), 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
  };
}

/**
 * Get the next month.
 */
export function getNextMonth(
  year: number,
  month: number,
): { year: number; month: number } {
  const date = addMonths(new Date(year, month, 1), 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
  };
}

/**
 * Generate an array of month options for the picker.
 * Only includes months from trackingStartMonth onwards.
 */
export function getMonthPickerOptions(
  baseMonth: Date,
  trackingStartMonth: Date,
  yearsAfter = 1,
): Array<{
  label: string;
  value: string;
  date: Date;
}> {
  const options: Array<{ label: string; value: string; date: Date }> = [];
  const startMonth = startOfMonth(trackingStartMonth);
  const endDate = startOfMonth(addMonths(new Date(), yearsAfter * 12));

  let currentDate = startMonth;
  while (currentDate <= endDate) {
    options.push({
      label: format(currentDate, "MMMM yyyy"),
      value: format(currentDate, "yyyy-MM-01"),
      date: currentDate,
    });
    currentDate = addMonths(currentDate, 1);
  }

  return options;
}
