export const dates = {
  // Date utility functions

  getDayOfMonth(date: Date = new Date()): number {
    return date.getDate();
  },

  getMonthYear(date: Date = new Date()): string {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  },

  getFirstDayOfMonth(date: Date = new Date()): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },

  getLastDayOfMonth(date: Date = new Date()): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  },

  getDaysInMonth(date: Date = new Date()): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  },

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  },
};
