import { MonthlyOverview } from "@/src/components/MonthlyOverview";
import { MonthlyStats } from "@/src/components/MonthlyStats";
import { useHabitsStore } from "@/src/store/habitsStore";
import { formatDateKey, getDaysInMonth } from "@/src/utils/dates";
import { addMonths, format, subMonths } from "date-fns";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function StatsScreen() {
  // Compute active habits inside selector to ensure proper subscription
  const activeHabits = useHabitsStore((state) => {
    if (state.uiState.activeHabitIds.length === 0) {
      return state.habits;
    }
    const validIds = state.uiState.activeHabitIds.filter((id) =>
      state.habits.some((h) => h.id === id),
    );
    if (validIds.length === 0) {
      return state.habits;
    }
    return state.habits.filter((h) => validIds.includes(h.id));
  });
  const entries = useHabitsStore((state) => state.entries);
  const isHydrated = useHabitsStore((state) => state.isHydrated);
  const totalHabits = useHabitsStore((state) => state.habits.length);

  const [viewDate, setViewDate] = React.useState(new Date());

  const handlePreviousMonth = () => {
    setViewDate(subMonths(viewDate, 1));
  };

  const handleNextMonth = () => {
    setViewDate(addMonths(viewDate, 1));
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

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = format(viewDate, "MMMM yyyy");
  const daysInMonth = getDaysInMonth(year, month);

  if (totalHabits === 0) {
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
      {/* Month Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handlePreviousMonth}
        >
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Statistics</Text>
          <Text style={styles.subtitle}>{monthLabel}</Text>
        </View>
        <TouchableOpacity style={styles.navButton} onPress={handleNextMonth}>
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Graphs & statistical feedback */}
        <MonthlyStats
          year={year}
          month={month}
          habits={activeHabits}
          entries={entries}
        />

        {/* Detailed day-by-day grid */}
        <Text style={styles.gridSectionTitle}>Detailed Grid</Text>
        <View style={styles.gridContainer}>
          <MonthlyOverview
            year={year}
            month={month}
            habits={activeHabits}
            daysInMonth={daysInMonth}
            entries={entries}
            formatDateKey={formatDateKey}
          />
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  gridSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 8,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  gridContainer: {
    height: 420,
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
    backgroundColor: "#fff",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  navButtonText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "600",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
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
