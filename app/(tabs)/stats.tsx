import { storage } from "@/src/storage/storage";
import { useHabitsStore } from "@/src/store/habitsStore";
import {
  formatDateKey,
  getDaysInMonth,
  getMonthLabel,
  parseMonthString,
} from "@/src/utils/dates";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function StatsScreen() {
  const {
    habits,
    entries,
    uiState,
    isHydrated,
    setHydrated,
    setHabits,
    setEntries,
    setUIState,
    getActiveHabits,
  } = useHabitsStore();

  // Hydrate store on screen focus
  useFocusEffect(
    React.useCallback(() => {
      if (!isHydrated) {
        (async () => {
          const loadedHabits = await storage.loadHabits();
          const loadedEntries = await storage.loadEntries();
          const loadedUIState = await storage.loadUIState();
          setHabits(loadedHabits);
          setEntries(loadedEntries);
          if (loadedUIState) {
            setUIState(loadedUIState);
          }
          setHydrated(true);
        })();
      }
    }, [isHydrated, setHabits, setEntries, setUIState, setHydrated]),
  );

  const calculateStats = () => {
    const activeHabits = getActiveHabits();
    const { year, month } = parseMonthString(uiState.selectedMonth);
    const daysInMonth = getDaysInMonth(year, month);
    const totalPossible = daysInMonth * activeHabits.length;

    let completedCount = 0;
    let missedCount = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day);
      for (const habit of activeHabits) {
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
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const activeHabits = getActiveHabits();
  const { year, month } = parseMonthString(uiState.selectedMonth);
  const monthLabel = getMonthLabel(year, month);
  const stats = calculateStats();

  if (habits.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>No habits yet</Text>
          <Text style={styles.emptySubText}>
            Create habits in the Grid tab to see statistics
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (activeHabits.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👀</Text>
          <Text style={styles.emptyText}>No habits selected</Text>
          <Text style={styles.emptySubText}>
            Select habits in the Grid tab to see their statistics
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>{monthLabel}</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Overall Stats */}
        <View style={styles.summaryContainer}>
          <View style={styles.statBox}>
            <Text style={styles.percentageText}>
              {stats.completionPercentage}%
            </Text>
            <Text style={styles.percentageLabel}>Completion Rate</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalPossible}</Text>
              <Text style={styles.statLabel}>Total Cells</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.doneColor]}>
                {stats.completed}
              </Text>
              <Text style={styles.statLabel}>✓ Done</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.missedColor]}>
                {stats.missed}
              </Text>
              <Text style={styles.statLabel}>✕ Missed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.empty}</Text>
              <Text style={styles.statLabel}>⚪ Empty</Text>
            </View>
          </View>
        </View>

        {/* Per Habit Stats */}
        <View style={styles.habitStatsContainer}>
          <Text style={styles.sectionTitle}>Per Habit Breakdown</Text>
          {activeHabits.map((habit) => {
            const daysInMonth = getDaysInMonth(year, month);
            let habitCompleted = 0;
            let habitMissed = 0;

            for (let day = 1; day <= daysInMonth; day++) {
              const dateKey = formatDateKey(year, month, day);
              const status = entries[`${dateKey}::${habit.id}`] ?? 0;
              if (status === 1) habitCompleted++;
              else if (status === 2) habitMissed++;
            }

            const habitPercentage =
              daysInMonth > 0
                ? Math.round((habitCompleted / daysInMonth) * 100)
                : 0;

            return (
              <View key={habit.id} style={styles.habitStatCard}>
                <Text style={styles.habitStatName}>{habit.name}</Text>
                <View style={styles.habitStatProgress}>
                  <View
                    style={[
                      styles.habitStatBar,
                      { width: `${habitPercentage}%` },
                    ]}
                  />
                </View>
                <View style={styles.habitStatDetails}>
                  <Text style={styles.habitStatText}>
                    {habitCompleted} / {daysInMonth} days
                  </Text>
                  <Text style={styles.habitStatPercent}>
                    {habitPercentage}%
                  </Text>
                </View>
                <View style={styles.habitStatMini}>
                  <Text style={styles.habitStatMiniText}>
                    ✓ {habitCompleted}
                  </Text>
                  <Text style={styles.habitStatMiniText}>✕ {habitMissed}</Text>
                  <Text style={styles.habitStatMiniText}>
                    ⚪ {daysInMonth - habitCompleted - habitMissed}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
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
  scrollContainer: {
    flex: 1,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
  },
  statBox: {
    backgroundColor: "#f0f9ff",
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  percentageText: {
    fontSize: 56,
    fontWeight: "700",
    color: "#0066cc",
  },
  percentageLabel: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#fafafa",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
    fontWeight: "500",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  doneColor: {
    color: "#10b981",
  },
  missedColor: {
    color: "#ef4444",
  },
  habitStatsContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  habitStatCard: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  habitStatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  habitStatProgress: {
    height: 8,
    backgroundColor: "#e5e5e5",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  habitStatBar: {
    height: "100%",
    backgroundColor: "#0066cc",
    borderRadius: 4,
  },
  habitStatDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  habitStatText: {
    fontSize: 14,
    color: "#666",
  },
  habitStatPercent: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0066cc",
  },
  habitStatMini: {
    flexDirection: "row",
    gap: 16,
  },
  habitStatMiniText: {
    fontSize: 13,
    color: "#666",
  },
});
