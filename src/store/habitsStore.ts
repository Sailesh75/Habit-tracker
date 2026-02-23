import { create } from "zustand";
import { storage } from "../storage/storage";

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

  // Initialization
  hydrate: () => Promise<void>;

  // Habit mutations (with auto-persist)
  addHabit: (name: string) => void;
  renameHabit: (id: string, newName: string) => void;
  deleteHabit: (id: string) => void;

  // Entry mutations (with auto-persist)
  toggleCell: (dateStr: string, habitId: string) => CellStatus;

  // UI state mutations (with auto-persist)
  setSelectedDate: (date: Date) => void;
  setActiveHabits: (habitIds: string[]) => void;
  toggleActiveHabit: (habitId: string) => void;

  // Utility methods
  getEntryStatus: (dateStr: string, habitId: string) => CellStatus;
  getActiveHabits: () => Habit[];

  // Clear all data
  clearAllData: () => Promise<void>;

  // Internal setters (for hydration only)
  _setHabits: (habits: Habit[]) => void;
  _setEntries: (entries: Record<string, CellStatus>) => void;
  _setUIState: (uiState: UIState) => void;
  _setHydrated: (hydrated: boolean) => void;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  entries: {},
  uiState: {
    selectedDate: new Date(),
    activeHabitIds: [],
  },
  isHydrated: false,

  // Hydrate from storage (called once on app startup)
  hydrate: async () => {
    try {
      const [loadedHabits, loadedEntries, loadedUIState] = await Promise.all([
        storage.loadHabits(),
        storage.loadEntries(),
        storage.loadUIState(),
      ]);

      set({
        habits: loadedHabits,
        entries: loadedEntries,
        uiState: loadedUIState || {
          selectedDate: new Date(),
          activeHabitIds: [],
        },
        isHydrated: true,
      });
    } catch (error) {
      console.error("Failed to hydrate store:", error);
      set({ isHydrated: true }); // Mark as hydrated even on error
    }
  },

  // Add habit with auto-persist
  addHabit: (name: string) => {
    set((state) => {
      const newHabit: Habit = {
        id: `habit_${Date.now()}`,
        name,
        order: Math.max(0, ...state.habits.map((h) => h.order), -1) + 1,
      };
      const newHabits = [...state.habits, newHabit];

      // Persist immediately (async but don't block UI)
      storage.saveHabits(newHabits);

      return { habits: newHabits };
    });
  },

  // Rename habit with auto-persist
  renameHabit: (id: string, newName: string) => {
    set((state) => {
      const newHabits = state.habits.map((h) =>
        h.id === id ? { ...h, name: newName } : h,
      );

      // Persist immediately
      storage.saveHabits(newHabits);

      return { habits: newHabits };
    });
  },

  // Delete habit with auto-persist
  deleteHabit: (id: string) => {
    set((state) => {
      const newHabits = state.habits.filter((h) => h.id !== id);
      const newEntries = Object.fromEntries(
        Object.entries(state.entries).filter(
          ([key]) => !key.endsWith(`::${id}`),
        ),
      );
      const newUIState = {
        ...state.uiState,
        activeHabitIds: state.uiState.activeHabitIds.filter(
          (hid) => hid !== id,
        ),
      };

      // Persist all changes immediately
      storage.saveHabits(newHabits);
      storage.saveEntries(newEntries);
      storage.saveUIState(newUIState);

      return {
        habits: newHabits,
        entries: newEntries,
        uiState: newUIState,
      };
    });
  },

  // Internal setters (used only during hydration)
  _setHabits: (habits: Habit[]) => {
    set({ habits });
  },

  _setEntries: (entries: Record<string, CellStatus>) => {
    set({ entries });
  },

  _setUIState: (uiState: UIState) => {
    set({ uiState });
  },

  _setHydrated: (hydrated: boolean) => {
    set({ isHydrated: hydrated });
  },

  // Set selected date with auto-persist
  setSelectedDate: (date: Date) => {
    set((state) => {
      const newUIState = { ...state.uiState, selectedDate: date };

      // Persist immediately
      storage.saveUIState(newUIState);

      return { uiState: newUIState };
    });
  },

  // Set active habits with auto-persist
  setActiveHabits: (habitIds: string[]) => {
    set((state) => {
      const newUIState = { ...state.uiState, activeHabitIds: habitIds };

      // Persist immediately
      storage.saveUIState(newUIState);

      return { uiState: newUIState };
    });
  },

  // Toggle active habit with auto-persist
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

      const newUIState = { ...state.uiState, activeHabitIds: nextActive };

      // Persist immediately
      storage.saveUIState(newUIState);

      return { uiState: newUIState };
    });
  },

  // Toggle cell with auto-persist
  toggleCell: (dateStr: string, habitId: string) => {
    const key = `${dateStr}::${habitId}`;
    const current = get().entries[key] ?? 0;
    const next = ((current + 1) % 3) as CellStatus;

    set((state) => {
      const newEntries = {
        ...state.entries,
        [key]: next,
      };

      // Persist immediately
      storage.saveEntries(newEntries);

      return { entries: newEntries };
    });

    return next;
  },

  getEntryStatus: (dateStr: string, habitId: string): CellStatus => {
    const key = `${dateStr}::${habitId}`;
    const status = get().entries[key] ?? 0;
    return status;
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

  // Clear all data (storage + state)
  clearAllData: async () => {
    await storage.clear();
    set({
      habits: [],
      entries: {},
      uiState: {
        selectedDate: new Date(),
        activeHabitIds: [],
      },
      isHydrated: true, // Keep hydrated flag true
    });
  },
}));
