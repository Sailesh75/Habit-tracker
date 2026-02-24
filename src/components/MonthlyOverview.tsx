import { format } from "date-fns";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { CellStatus, Habit } from "../store/habitsStore";

interface MonthlyOverviewProps {
  year: number;
  month: number; // 0-indexed
  habits: Habit[];
  daysInMonth: number;
  entries: Record<string, CellStatus>;
  formatDateKey: (year: number, month: number, day: number) => string;
}

export function MonthlyOverview({
  year,
  month,
  habits,
  daysInMonth,
  entries,
  formatDateKey,
}: MonthlyOverviewProps) {
  const getStatus = (dateKey: string, habitId: string): CellStatus => {
    const key = `${dateKey}::${habitId}`;
    return entries[key] ?? 0;
  };
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthName = format(new Date(year, month, 1), "MMMM yyyy");

  const getCellStyle = (status: CellStatus) => {
    switch (status) {
      case 1:
        return { backgroundColor: "#10b981", text: "✓", color: "#fff" };
      case 2:
        return { backgroundColor: "#ef4444", text: "✕", color: "#fff" };
      default:
        return { backgroundColor: "#f0f0f0", text: "", color: "#999" };
    }
  };

  if (habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyText}>No habits to show</Text>
        <Text style={styles.emptySubText}>
          Add habits to see your monthly overview
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Month Header */}
      <View style={styles.header}>
        <Text style={styles.monthTitle}>{monthName}</Text>
      </View>

      {/* Grid - Horizontal scroll for habits, vertical scroll for days */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        <View>
          {/* Habit Names Header */}
          <View style={styles.headerRow}>
            <View style={styles.dateCell}>
              <Text style={styles.dateCellText}>Date</Text>
            </View>
            {habits.map((habit) => (
              <View key={habit.id} style={styles.habitHeaderCell}>
                <Text style={styles.habitHeaderText} numberOfLines={2}>
                  {habit.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Day Rows */}
          <ScrollView style={styles.verticalScroll}>
            {days.map((day) => {
              const dateKey = formatDateKey(year, month, day);
              const dayLabel = format(new Date(year, month, day), "MMM d");

              return (
                <View key={day} style={styles.dayRow}>
                  {/* Date Label */}
                  <View style={styles.dateCell}>
                    <Text style={styles.dateCellText}>{dayLabel}</Text>
                  </View>

                  {/* Habit Cells */}
                  {habits.map((habit) => {
                    const status = getStatus(dateKey, habit.id);
                    const cellStyle = getCellStyle(status);

                    return (
                      <View
                        key={habit.id}
                        style={[
                          styles.statusCell,
                          { backgroundColor: cellStyle.backgroundColor },
                        ]}
                      >
                        {cellStyle.text ? (
                          <Text
                            style={[
                              styles.cellText,
                              { color: cellStyle.color },
                            ]}
                          >
                            {cellStyle.text}
                          </Text>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  horizontalScroll: {
    flex: 1,
  },
  verticalScroll: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#e5e5e5",
    backgroundColor: "#f9f9f9",
  },
  dateCell: {
    width: 80,
    padding: 12,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#e5e5e5",
  },
  dateCellText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  habitHeaderCell: {
    width: 80,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  habitHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
  dayRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statusCell: {
    width: 80,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#f0f0f0",
  },
  cellText: {
    fontSize: 16,
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
