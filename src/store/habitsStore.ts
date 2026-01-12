import { create } from "zustand";

export interface Habit {
  id: string;
  name: string;
  order: number;
}

export type CellStatus = 0 | 1 | 2; // 0: empty, 1: done, 2: missed

interface HabitsState {
  habits: Habit[];
  entries: Record<string, CellStatus>;
  isHydrated: boolean;
  addHabit: (name: string) => void;
  deleteHabit: (id: string) => void;
  setHabits: (habits: Habit[]) => void;
  setEntries: (entries: Record<string, CellStatus>) => void;
  toggleCell: (dateStr: string, habitId: string) => CellStatus;
  getEntryStatus: (dateStr: string, habitId: string) => CellStatus;
  setHydrated: (hydrated: boolean) => void;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  entries: {},
  isHydrated: false,

  addHabit: (name: string) => {
    set((state) => {
      const newHabit: Habit = {
        id: `habit_${Date.now()}`,
        name,
        order: Math.max(0, ...state.habits.map((h) => h.order), -1) + 1,
      };
      return { habits: [...state.habits, newHabit] };
    });
  },

  deleteHabit: (id: string) => {
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
      entries: Object.fromEntries(
        Object.entries(state.entries).filter(
          ([key]) => !key.endsWith(`::${id}`)
        )
      ),
    }));
  },

  setHabits: (habits: Habit[]) => {
    set({ habits });
  },

  setEntries: (entries: Record<string, CellStatus>) => {
    set({ entries });
  },

  toggleCell: (dateStr: string, habitId: string) => {
    const key = `${dateStr}::${habitId}`;
    const current = get().entries[key] ?? 0;
    const next = ((current + 1) % 3) as CellStatus;
    set((state) => ({
      entries: {
        ...state.entries,
        [key]: next,
      },
    }));
    return next;
  },

  getEntryStatus: (dateStr: string, habitId: string): CellStatus => {
    const key = `${dateStr}::${habitId}`;
    return get().entries[key] ?? 0;
  },

  setHydrated: (hydrated: boolean) => {
    set({ isHydrated: hydrated });
  },
}));
