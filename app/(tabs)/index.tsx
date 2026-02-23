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
          <Text style={styles.habitsButtonText}>
            📋 Manage Habits ({habits.length})
          </Text>
        </TouchableOpacity>
        {activeHabits.length !== habits.length && habits.length > 0 && (
          <Text style={styles.filterText}>
            Showing {activeHabits.length} of {habits.length} habits
          </Text>
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
              ? 'Tap "Manage Habits" to add your first habit'
              : 'Open "Manage Habits" to select which habits to display'}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
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
    borderBottomColor: "#e5e5e5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  habitsButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#0066cc",
    borderRadius: 8,
  },
  habitsButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  filterText: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#0066cc",
    borderRadius: 12,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
