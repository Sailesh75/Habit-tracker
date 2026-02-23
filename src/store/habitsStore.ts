import { create } from "zustand";

export interface Habit {
  id: string;
  name: string;
  order: number;
}

export type CellStatus = 0 | 1 | 2; // 0: empty, 1: done, 2: missed

export interface UIState {
  selectedDate: Date; // the currently selected date
  activeHabitIds: string[]; // empty means all habits are active
}

interface HabitsState {
  habits: Habit[];
  entries: Record<string, CellStatus>;
  uiState: UIState;
  isHydrated: boolean;
  addHabit: (name: string) => void;
  renameHabit: (id: string, newName: string) => void;
  deleteHabit: (id: string) => void;
  setHabits: (habits: Habit[]) => void;
  setEntries: (entries: Record<string, CellStatus>) => void;
  setUIState: (uiState: UIState) => void;
  setSelectedDate: (date: Date) => void;
  setActiveHabits: (habitIds: string[]) => void;
  toggleActiveHabit: (habitId: string) => void;
  toggleCell: (dateStr: string, habitId: string) => CellStatus;
  getEntryStatus: (dateStr: string, habitId: string) => CellStatus;
  setHydrated: (hydrated: boolean) => void;
  getActiveHabits: () => Habit[];
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  entries: {},
  uiState: {
    selectedDate: new Date(),
    activeHabitIds: [],
  },
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

  renameHabit: (id: string, newName: string) => {
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, name: newName } : h,
      ),
    }));
  },

  deleteHabit: (id: string) => {
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
      entries: Object.fromEntries(
        Object.entries(state.entries).filter(
          ([key]) => !key.endsWith(`::${id}`),
        ),
      ),
      uiState: {
        ...state.uiState,
        activeHabitIds: state.uiState.activeHabitIds.filter(
          (hid) => hid !== id,
        ),
      },
    }));
  },

  setHabits: (habits: Habit[]) => {
    set({ habits });
  },

  setEntries: (entries: Record<string, CellStatus>) => {
    set({ entries });
  },

  setUIState: (uiState: UIState) => {
    set({ uiState });
  },

  setSelectedDate: (date: Date) => {
    set((state) => ({
      uiState: { ...state.uiState, selectedDate: date },
    }));
  },

  setActiveHabits: (habitIds: string[]) => {
    set((state) => ({
      uiState: { ...state.uiState, activeHabitIds: habitIds },
    }));
  },

  toggleActiveHabit: (habitId: string) => {
    set((state) => {
      const allHabitIds = state.habits.map((h) => h.id);
      const effectiveActive =
        state.uiState.activeHabitIds.length === 0
          ? allHabitIds
          : state.uiState.activeHabitIds;

      const isActive = effectiveActive.includes(habitId);
      const updated = isActive
        ? effectiveActive.filter((id) => id !== habitId)
        : [...effectiveActive, habitId];

      const nextActive =
        updated.length === allHabitIds.length ? [] : updated.slice();

      return {
        uiState: { ...state.uiState, activeHabitIds: nextActive },
      };
    });
  },

  toggleCell: (dateStr: string, habitId: string) => {
    const key = `${dateStr}::${habitId}`;
    const current = get().entries[key] ?? 0;
    const next = ((current + 1) % 3) as CellStatus;
    console.log(
      `🔄 toggleCell - key: "${key}", current: ${current}, next: ${next}`,
    );
    set((state) => ({
      entries: {
        ...state.entries,
        [key]: next,
      },
    }));
    console.log(
      `📦 All entries after toggle:`,
      JSON.stringify(get().entries, null, 2),
    );
    return next;
  },

  getEntryStatus: (dateStr: string, habitId: string): CellStatus => {
    const key = `${dateStr}::${habitId}`;
    const status = get().entries[key] ?? 0;
    if (status !== 0) {
      console.log(`📖 getEntryStatus - key: "${key}", status: ${status}`);
    }
    return status;
  },

  setHydrated: (hydrated: boolean) => {
    set({ isHydrated: hydrated });
  },

  getActiveHabits: (): Habit[] => {
    const state = get();
    if (state.uiState.activeHabitIds.length === 0) {
      return state.habits;
    }
    return state.habits.filter((h) =>
      state.uiState.activeHabitIds.includes(h.id),
    );
  },
}));
