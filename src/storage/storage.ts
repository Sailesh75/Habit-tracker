import AsyncStorage from "@react-native-async-storage/async-storage";

const HABITS_KEY = "habits";
const TRACKING_DATA_KEY = "tracking_data";

export const storage = {
  async getHabits() {
    try {
      const data = await AsyncStorage.getItem(HABITS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading habits:", error);
      return [];
    }
  },

  async saveHabits(habits: any) {
    try {
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error("Error saving habits:", error);
    }
  },

  async getTrackingData() {
    try {
      const data = await AsyncStorage.getItem(TRACKING_DATA_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Error reading tracking data:", error);
      return {};
    }
  },

  async saveTrackingData(data: any) {
    try {
      await AsyncStorage.setItem(TRACKING_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving tracking data:", error);
    }
  },
};
