import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Habit } from "../store/habitsStore";

interface HabitHeaderProps {
  habits: Habit[];
  cellSize?: number;
  dayColumnWidth?: number;
}

const DEFAULT_CELL_SIZE = 40;
const DEFAULT_DAY_COLUMN_WIDTH = 45;

export function HabitHeader({
  habits,
  cellSize = DEFAULT_CELL_SIZE,
  dayColumnWidth = DEFAULT_DAY_COLUMN_WIDTH,
}: HabitHeaderProps) {
  return (
    <View style={[styles.headerContainer, { height: cellSize + 8 }]}>
      {/* Fixed day column placeholder */}
      <View style={[styles.dayColumn, { width: dayColumnWidth }]} />

      {/* Habit names */}
      <View style={styles.habitsRow}>
        {habits.map((habit) => (
          <View
            key={habit.id}
            style={[
              styles.habitCell,
              {
                width: cellSize,
              },
            ]}
          >
            <Text style={[styles.habitName, { fontSize: cellSize * 0.35 }]}>
              {habit.name.substring(0, 3)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#333",
    backgroundColor: "#f5f5f5",
  },
  dayColumn: {
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  habitsRow: {
    flexDirection: "row",
    flex: 1,
  },
  habitCell: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  habitName: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
