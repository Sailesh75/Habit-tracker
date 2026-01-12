import AsyncStorage from "@react-native-async-storage/async-storage";
import { CellStatus, Habit } from "../store/habitsStore";

const HABITS_KEY = "habits:v1";
const ENTRIES_KEY = "entries:v1";

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

  async saveEntry(
    dateStr: string,
    habitId: string,
    status: CellStatus
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
      await AsyncStorage.multiRemove([HABITS_KEY, ENTRIES_KEY]);
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  },
};
