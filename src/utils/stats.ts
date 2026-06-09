import { CellStatus, Habit } from "../store/habitsStore";
import { formatDateKey, getDaysInMonth } from "./dates";

export interface HabitStat {
  habit: Habit;
  doneCount: number;
  missedCount: number;
  rate: number; // done / elapsedDays, 0..1
  currentStreak: number; // trailing consecutive done days up to the reference day
  longestStreak: number; // longest run of consecutive done days in the month
}

export interface DailyPoint {
  day: number; // 1-indexed day of month
  done: number; // habits marked done that day
  total: number; // number of tracked habits
  isElapsed: boolean; // whether this day has occurred (<= reference day)
}

export interface MonthStats {
  year: number;
  month: number; // 0-indexed
  daysInMonth: number;
  elapsedDays: number; // days that have occurred this month relative to the reference date
  totalHabits: number;
  doneCount: number;
  missedCount: number;
  possible: number; // totalHabits * elapsedDays
  completionRate: number; // doneCount / possible, 0..1
  perHabit: HabitStat[];
  daily: DailyPoint[];
  isFuture: boolean; // viewed month is entirely in the future (no data possible yet)
}

/**
 * How many days of the given month have elapsed relative to `reference`.
 * - Past month  -> all days in the month
 * - Current month -> up to and including today
 * - Future month -> 0
 */
function getElapsedDays(
  year: number,
  month: number,
  daysInMonth: number,
  reference: Date,
): number {
  const refYear = reference.getFullYear();
  const refMonth = reference.getMonth();

  if (year < refYear || (year === refYear && month < refMonth)) {
    return daysInMonth;
  }
  if (year === refYear && month === refMonth) {
    return reference.getDate();
  }
  return 0;
}

/**
 * Compute monthly statistics for a set of habits from the flat entries record.
 * Pure function — safe to memoize on (year, month, habits, entries).
 */
export function computeMonthStats(
  year: number,
  month: number,
  habits: Habit[],
  entries: Record<string, CellStatus>,
  reference: Date = new Date(),
): MonthStats {
  const daysInMonth = getDaysInMonth(year, month);
  const elapsedDays = getElapsedDays(year, month, daysInMonth, reference);
  const totalHabits = habits.length;

  const statusAt = (day: number, habitId: string): CellStatus => {
    const key = `${formatDateKey(year, month, day)}::${habitId}`;
    return entries[key] ?? 0;
  };

  // Per-habit aggregation (done/missed counts + streaks).
  const perHabit: HabitStat[] = habits.map((habit) => {
    let doneCount = 0;
    let missedCount = 0;
    let longestStreak = 0;
    let run = 0;

    // Iterate only elapsed days; future days carry no data.
    for (let day = 1; day <= elapsedDays; day++) {
      const status = statusAt(day, habit.id);
      if (status === 1) {
        doneCount++;
        run++;
        if (run > longestStreak) longestStreak = run;
      } else {
        if (status === 2) missedCount++;
        run = 0;
      }
    }

    // Current streak: walk backwards from the last elapsed day.
    let currentStreak = 0;
    for (let day = elapsedDays; day >= 1; day--) {
      if (statusAt(day, habit.id) === 1) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      habit,
      doneCount,
      missedCount,
      rate: elapsedDays > 0 ? doneCount / elapsedDays : 0,
      currentStreak,
      longestStreak,
    };
  });

  // Daily trend: how many habits were done on each day of the month.
  const daily: DailyPoint[] = Array.from(
    { length: daysInMonth },
    (_, i): DailyPoint => {
      const day = i + 1;
      let done = 0;
      for (const habit of habits) {
        if (statusAt(day, habit.id) === 1) done++;
      }
      return { day, done, total: totalHabits, isElapsed: day <= elapsedDays };
    },
  );

  const doneCount = perHabit.reduce((sum, h) => sum + h.doneCount, 0);
  const missedCount = perHabit.reduce((sum, h) => sum + h.missedCount, 0);
  const possible = totalHabits * elapsedDays;

  return {
    year,
    month,
    daysInMonth,
    elapsedDays,
    totalHabits,
    doneCount,
    missedCount,
    possible,
    completionRate: possible > 0 ? doneCount / possible : 0,
    perHabit,
    daily,
    isFuture: elapsedDays === 0,
  };
}
