import { format } from "date-fns";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CellStatus, Habit } from "../store/habitsStore";

interface DailyViewProps {
  selectedDate: Date;
  habits: Habit[];
  getStatus: (dateKey: string, habitId: string) => CellStatus;
  onToggleHabit: (dateKey: string, habitId: string) => void;
}

export function DailyView({
  selectedDate,
  habits,
  getStatus,
  onToggleHabit,
}: DailyViewProps) {
  const dateKey = format(selectedDate, "yyyy-MM-dd");

  // Calculate completion progress
  const completedCount = habits.filter((habit) => {
    const status = getStatus(dateKey, habit.id);
    return status === 1; // 1 = completed
  }).length;

  const getCheckboxStyle = (status: CellStatus) => {
    switch (status) {
      case 1:
        return { backgroundColor: "#10b981", icon: "✓" }; // Green check
      case 2:
        return { backgroundColor: "#ef4444", icon: "✕" }; // Red X
      default:
        return { backgroundColor: "#f0f0f0", icon: "" }; // Empty gray
    }
  };

  if (habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📝</Text>
        <Text style={styles.emptyText}>No habits yet</Text>
        <Text style={styles.emptySubText}>
          Tap "Manage Habits" to add your first habit
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>
          {completedCount} of {habits.length} completed
        </Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${habits.length > 0 ? (completedCount / habits.length) * 100 : 0}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Habits List */}
      <ScrollView
        style={styles.habitsList}
        contentContainerStyle={styles.habitsListContent}
      >
        {habits.map((habit) => {
          const status = getStatus(dateKey, habit.id);
          const checkboxStyle = getCheckboxStyle(status);

          return (
            <TouchableOpacity
              key={habit.id}
              style={styles.habitRow}
              onPress={() => onToggleHabit(dateKey, habit.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.habitName}>{habit.name}</Text>
              <View
                style={[
                  styles.checkbox,
                  { backgroundColor: checkboxStyle.backgroundColor },
                ]}
              >
                {checkboxStyle.icon ? (
                  <Text style={styles.checkboxIcon}>{checkboxStyle.icon}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  progressHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 4,
  },
  habitsList: {
    flex: 1,
  },
  habitsListContent: {
    padding: 20,
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  habitName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  checkboxIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
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
  },
});
