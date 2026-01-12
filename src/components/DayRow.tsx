import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { CellStatus, Habit } from "../store/habitsStore";
import { Cell } from "./Cell";

interface DayRowProps {
  day: number;
  habits: Habit[];
  entries: Record<string, CellStatus>;
  dateKey: string;
  onToggleCell: (habitId: string, newStatus: CellStatus) => void;
  cellSize?: number;
  dayColumnWidth?: number;
}

const DEFAULT_CELL_SIZE = 40;
const DEFAULT_DAY_COLUMN_WIDTH = 45;

export function DayRow({
  day,
  habits,
  entries,
  dateKey,
  onToggleCell,
  cellSize = DEFAULT_CELL_SIZE,
  dayColumnWidth = DEFAULT_DAY_COLUMN_WIDTH,
}: DayRowProps) {
  return (
    <View style={styles.row}>
      {/* Fixed day number column */}
      <View
        style={[
          styles.dayColumn,
          {
            width: dayColumnWidth,
            height: cellSize,
          },
        ]}
      >
        <Text style={styles.dayText}>{day}</Text>
      </View>

      {/* Horizontally scrollable habit cells */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        style={styles.habitsScroll}
      >
        {habits.map((habit) => {
          const status = entries[`${dateKey}::${habit.id}`] ?? 0;
          return (
            <Cell
              key={habit.id}
              status={status}
              onPress={() => {
                const nextStatus = (status + 1) % 3;
                onToggleCell(habit.id, nextStatus);
              }}
              size={cellSize}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dayColumn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  habitsScroll: {
    flex: 1,
  },
});
