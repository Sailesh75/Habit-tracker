import AsyncStorage from "@react-native-async-storage/async-storage";
import { CellStatus, Habit, UIState } from "../store/habitsStore";

const HABITS_KEY = "habits:v1";
const ENTRIES_KEY = "entries:v1";
const UI_STATE_KEY = "ui:v2"; // bumped version for new structure

export const storage = {
  async loadHabits(): Promise<Habit[]> {
    try {
      const data = await AsyncStorage.getItem(HABITS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load habits:", error);
      return [];
    }
  },

  async saveHabits(habits: Habit[]): Promise<void> {
    try {
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error("Failed to save habits:", error);
    }
  },

  async loadEntries(): Promise<Record<string, CellStatus>> {
    try {
      const data = await AsyncStorage.getItem(ENTRIES_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Failed to load entries:", error);
      return {};
    }
  },

  async saveEntries(entries: Record<string, CellStatus>): Promise<void> {
    try {
      await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error("Failed to save entries:", error);
    }
  },

  async loadUIState(): Promise<UIState | null> {
    try {
      const data = await AsyncStorage.getItem(UI_STATE_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data);
      // Convert selectedDate string back to Date object
      return {
        ...parsed,
        selectedDate: parsed.selectedDate
          ? new Date(parsed.selectedDate)
          : new Date(),
      };
    } catch (error) {
      console.error("Failed to load UI state:", error);
      return null;
    }
  },

  async saveUIState(uiState: UIState): Promise<void> {
    try {
      // Serialize Date to ISO string
      const serializable = {
        ...uiState,
        selectedDate: uiState.selectedDate.toISOString(),
      };
      await AsyncStorage.setItem(UI_STATE_KEY, JSON.stringify(serializable));
    } catch (error) {
      console.error("Failed to save UI state:", error);
    }
  },

  async saveEntry(
    dateStr: string,
    habitId: string,
    status: CellStatus,
  ): Promise<void> {
    try {
      const key = `${dateStr}::${habitId}`;
      const entries = await this.loadEntries();
      entries[key] = status;
      await this.saveEntries(entries);
    } catch (error) {
      console.error("Failed to save entry:", error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([HABITS_KEY, ENTRIES_KEY, UI_STATE_KEY]);
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  },
};
