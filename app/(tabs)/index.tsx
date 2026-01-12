import { DayRow } from "@/src/components/DayRow";
import { HabitHeader } from "@/src/components/HabitHeader";
import { storage } from "@/src/storage/storage";
import { useHabitsStore } from "@/src/store/habitsStore";
import {
  formatDateKey,
  getCurrentMonthInfo,
  getDaysInMonth,
  getMonthLabel,
} from "@/src/utils/dates";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const CELL_SIZE = 40;
const DAY_COLUMN_WIDTH = 45;

export default function GridScreen() {
  const {
    habits,
    entries,
    isHydrated,
    setHydrated,
    setHabits,
    setEntries,
    toggleCell,
  } = useHabitsStore();
  const [yearMonth] = useState(getCurrentMonthInfo());

  // Hydrate store on first mount
  useFocusEffect(
    React.useCallback(() => {
      if (!isHydrated) {
        (async () => {
          const loadedHabits = await storage.loadHabits();
          const loadedEntries = await storage.loadEntries();
          setHabits(loadedHabits);
          setEntries(loadedEntries);
          setHydrated(true);
        })();
      }
    }, [isHydrated, setHabits, setEntries, setHydrated])
  );

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  if (habits.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No habits yet!</Text>
          <Text style={styles.emptySubText}>
            Go to the Habits tab to create some.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const daysInMonth = getDaysInMonth(yearMonth.year, yearMonth.month);
  const monthLabel = getMonthLabel(yearMonth.year, yearMonth.month);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.monthLabel}>{monthLabel}</Text>

      {/* Header row with habit names */}
      <HabitHeader
        habits={habits}
        cellSize={CELL_SIZE}
        dayColumnWidth={DAY_COLUMN_WIDTH}
      />

      {/* Days list */}
      <FlatList
        data={days}
        keyExtractor={(day) => day.toString()}
        renderItem={({ item: day }) => {
          const dateKey = formatDateKey(yearMonth.year, yearMonth.month, day);
          return (
            <DayRow
              day={day}
              habits={habits}
              entries={entries}
              dateKey={dateKey}
              onToggleCell={(habitId, newStatus) => {
                toggleCell(dateKey, habitId);
                storage.saveEntry(dateKey, habitId, newStatus);
              }}
              cellSize={CELL_SIZE}
              dayColumnWidth={DAY_COLUMN_WIDTH}
            />
          );
        }}
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  monthLabel: {
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
