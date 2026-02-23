import { MonthlyOverview } from "@/src/components/MonthlyOverview";
import { useHabitsStore } from "@/src/store/habitsStore";
import { formatDateKey, getDaysInMonth } from "@/src/utils/dates";
import { addMonths, format, subMonths } from "date-fns";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function StatsScreen() {
  // Use selector functions to subscribe to each state piece separately
  const habits = useHabitsStore((state) => state.habits);
  const entries = useHabitsStore((state) => state.entries);
  const isHydrated = useHabitsStore((state) => state.isHydrated);
  const getActiveHabits = useHabitsStore((state) => state.getActiveHabits);

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

  const activeHabits = getActiveHabits();
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = format(viewDate, "MMMM yyyy");
  const daysInMonth = getDaysInMonth(year, month);

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
      {/* Month Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handlePreviousMonth}
        >
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Monthly Overview</Text>
          <Text style={styles.subtitle}>{monthLabel}</Text>
        </View>
        <TouchableOpacity style={styles.navButton} onPress={handleNextMonth}>
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Monthly Grid Overview */}
      <MonthlyOverview
        year={year}
        month={month}
        habits={activeHabits}
        daysInMonth={daysInMonth}
        entries={entries}
        formatDateKey={formatDateKey}
      />
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
