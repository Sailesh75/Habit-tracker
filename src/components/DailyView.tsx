import { format } from "date-fns";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { CellStatus, Habit } from "../store/habitsStore";

interface DailyViewProps {
  selectedDate: Date;
  habits: Habit[];
  entries: Record<string, CellStatus>;
  onToggleHabit: (dateKey: string, habitId: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

export function DailyView({
  selectedDate,
  habits,
  entries,
  onToggleHabit,
  onDeleteHabit,
}: DailyViewProps) {
  const dateKey = format(selectedDate, "yyyy-MM-dd");

  const getStatus = (habitId: string): CellStatus => {
    const key = `${dateKey}::${habitId}`;
    return entries[key] ?? 0;
  };

  // Calculate completion progress
  const completedCount = habits.filter((habit) => {
    const status = getStatus(habit.id);
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

  const handleDelete = (habit: Habit) => {
    Alert.alert(
      "Delete Habit",
      `Delete "${habit.name}"? All data will be lost.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteHabit(habit.id),
        },
      ],
    );
  };

  const renderRightActions = (habit: Habit) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleDelete(habit)}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteActionText}>Delete</Text>
      </TouchableOpacity>
    );
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
          const status = getStatus(habit.id);
          const checkboxStyle = getCheckboxStyle(status);

          return (
            <Swipeable
              key={habit.id}
              renderRightActions={() => renderRightActions(habit)}
              friction={2}
              overshootRight={false}
            >
              <TouchableOpacity
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
                    <Text style={styles.checkboxIcon}>
                      {checkboxStyle.icon}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            </Swipeable>
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
    padding: 16,
    gap: 8,
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  checkboxIcon: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  deleteAction: {
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 10,
    marginLeft: 8,
  },
  deleteActionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
