import { storage } from "@/src/storage/storage";
import { useHabitsStore } from "@/src/store/habitsStore";
import {
  formatDateKey,
  getCurrentMonthInfo,
  getDaysInMonth,
  getMonthLabel,
} from "@/src/utils/dates";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function StatsScreen() {
  const { habits, entries, isHydrated, setHydrated, setHabits, setEntries } =
    useHabitsStore();
  const [yearMonth] = React.useState(getCurrentMonthInfo());

  // Hydrate store on screen focus
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

  const calculateStats = () => {
    const daysInMonth = getDaysInMonth(yearMonth.year, yearMonth.month);
    const totalPossible = daysInMonth * habits.length;

    let completedCount = 0;
    let missedCount = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(yearMonth.year, yearMonth.month, day);
      for (const habit of habits) {
        const status = entries[`${dateKey}::${habit.id}`] ?? 0;
        if (status === 1) completedCount++;
        else if (status === 2) missedCount++;
      }
    }

    const completionPercentage =
      totalPossible > 0
        ? Math.round((completedCount / totalPossible) * 100)
        : 0;

    return {
      totalPossible,
      completed: completedCount,
      missed: missedCount,
      empty: totalPossible - completedCount - missedCount,
      completionPercentage,
    };
  };

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  const stats = calculateStats();
  const monthLabel = getMonthLabel(yearMonth.year, yearMonth.month);

  if (habits.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Stats</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No habits yet!</Text>
          <Text style={styles.emptySubText}>
            Create habits to see statistics.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Stats</Text>

      <View style={styles.summaryContainer}>
        <Text style={styles.monthText}>{monthLabel}</Text>

        <View style={styles.statBox}>
          <Text style={styles.percentageText}>
            {stats.completionPercentage}%
          </Text>
          <Text style={styles.percentageLabel}>Completion Rate</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Cells</Text>
            <Text style={styles.statValue}>{stats.totalPossible}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>✅ Done</Text>
            <Text style={[styles.statValue, styles.doneColor]}>
              {stats.completed}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>❌ Missed</Text>
            <Text style={[styles.statValue, styles.missedColor]}>
              {stats.missed}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Empty</Text>
            <Text style={styles.statValue}>{stats.empty}</Text>
          </View>
        </View>
      </View>

      {/* Habit-wise stats */}
      <View style={styles.habitStatsContainer}>
        <Text style={styles.habitStatsTitle}>Per Habit</Text>
        <FlatList
          data={habits}
          keyExtractor={(habit) => habit.id}
          renderItem={({ item: habit }) => {
            const daysInMonth = getDaysInMonth(yearMonth.year, yearMonth.month);
            let habitCompleted = 0;

            for (let day = 1; day <= daysInMonth; day++) {
              const dateKey = formatDateKey(
                yearMonth.year,
                yearMonth.month,
                day
              );
              const status = entries[`${dateKey}::${habit.id}`] ?? 0;
              if (status === 1) habitCompleted++;
            }

            const habitPercentage =
              daysInMonth > 0
                ? Math.round((habitCompleted / daysInMonth) * 100)
                : 0;

            return (
              <View style={styles.habitStatItem}>
                <View style={styles.habitStatInfo}>
                  <Text style={styles.habitStatName}>{habit.name}</Text>
                  <Text style={styles.habitStatDetail}>
                    {habitCompleted}/{daysInMonth} ({habitPercentage}%)
                  </Text>
                </View>
              </View>
            );
          }}
          scrollEnabled={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
  },
  summaryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  statBox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  percentageText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#007AFF",
  },
  percentageLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  doneColor: {
    color: "#28a745",
  },
  missedColor: {
    color: "#dc3545",
  },
  habitStatsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  habitStatsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  habitStatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  habitStatInfo: {
    flex: 1,
  },
  habitStatName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  habitStatDetail: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
});
