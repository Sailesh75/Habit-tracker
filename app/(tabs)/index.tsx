import { CalendarModal } from "@/src/components/CalendarModal";
import { DailyView } from "@/src/components/DailyView";
import { DateNavigation } from "@/src/components/DateNavigation";
import { HabitsModal } from "@/src/components/HabitsModal";
import { useHabitsStore } from "@/src/store/habitsStore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DailyScreen() {
  // Use selector functions to subscribe to each state piece separately
  const habits = useHabitsStore((state) => state.habits);
  const entries = useHabitsStore((state) => state.entries);
  const uiState = useHabitsStore((state) => state.uiState);
  const isHydrated = useHabitsStore((state) => state.isHydrated);
  const setSelectedDate = useHabitsStore((state) => state.setSelectedDate);
  const toggleActiveHabit = useHabitsStore((state) => state.toggleActiveHabit);
  const toggleCell = useHabitsStore((state) => state.toggleCell);
  const addHabit = useHabitsStore((state) => state.addHabit);
  const renameHabit = useHabitsStore((state) => state.renameHabit);
  const deleteHabit = useHabitsStore((state) => state.deleteHabit);

  // Derived selector: compute activeHabits from habits and activeHabitIds
  const activeHabits = useHabitsStore((state) => {
    const { habits, uiState } = state;
    const activeIds = uiState.activeHabitIds;

    if (activeIds.length === 0) {
      return habits;
    }

    const validIds = activeIds.filter((id) => habits.some((h) => h.id === id));

    if (validIds.length === 0) {
      return habits;
    }

    return habits.filter((h) => validIds.includes(h.id));
  });

  const [showHabitsModal, setShowHabitsModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddHabit = (name: string) => {
    addHabit(name);
  };

  const handleRenameHabit = (id: string, newName: string) => {
    renameHabit(id, newName);
  };

  const handleDeleteHabit = (id: string) => {
    deleteHabit(id);
  };

  const handleToggleActiveHabit = (habitId: string) => {
    toggleActiveHabit(habitId);
  };

  const handleToggleHabit = (dateKey: string, habitId: string) => {
    toggleCell(dateKey, habitId);
  };

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const selectedDate = uiState.selectedDate;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Date Navigation */}
        <DateNavigation
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onOpenCalendar={() => setShowCalendarModal(true)}
        />

        {/* Habits Button */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={styles.habitsButton}
            onPress={() => setShowHabitsModal(true)}
          >
            <Text style={styles.habitsButtonText}>📋 Add Habits</Text>
          </TouchableOpacity>
          {activeHabits.length !== habits.length && habits.length > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterText}>
                {activeHabits.length}/{habits.length}
              </Text>
            </View>
          )}
        </View>

        {/* Daily View - Shows only selected date's habits */}
        {activeHabits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              {habits.length === 0 ? "📝" : "👀"}
            </Text>
            <Text style={styles.emptyText}>
              {habits.length === 0 ? "No habits yet" : "No habits selected"}
            </Text>
            <Text style={styles.emptySubText}>
              {habits.length === 0
                ? 'Tap "Add Habits" to add your first habit'
                : 'Open "Add Habits" to select which habits to display'}
            </Text>
            {habits.length === 0 && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setShowHabitsModal(true)}
              >
                <Text style={styles.emptyButtonText}>Add Your First Habit</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <DailyView
            selectedDate={selectedDate}
            habits={activeHabits}
            entries={entries}
            onToggleHabit={handleToggleHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        )}

        {/* Habits Modal */}
        <HabitsModal
          visible={showHabitsModal}
          onClose={() => setShowHabitsModal(false)}
          habits={habits}
          activeHabitIds={uiState.activeHabitIds}
          onAddHabit={handleAddHabit}
          onRenameHabit={handleRenameHabit}
          onDeleteHabit={handleDeleteHabit}
          onToggleActiveHabit={handleToggleActiveHabit}
        />

        {/* Calendar Modal */}
        <CalendarModal
          visible={showCalendarModal}
          selectedDate={selectedDate}
          onClose={() => setShowCalendarModal(false)}
          onSelectDate={handleDateChange}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  toolbar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  habitsButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#10b981",
    borderRadius: 10,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  habitsButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  filterBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  filterText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: "#fff",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: "#10b981",
    borderRadius: 12,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
