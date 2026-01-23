import { DayRow } from "@/src/components/DayRow";
import { HabitHeaderRow } from "@/src/components/HabitHeaderRow";
import { HabitsModal } from "@/src/components/HabitsModal";
import { MonthHeader } from "@/src/components/MonthHeader";
import { storage } from "@/src/storage/storage";
import { useHabitsStore } from "@/src/store/habitsStore";
import {
  formatDateKey,
  getDaysInMonth,
  monthDateToString,
  monthStringToDate,
  parseMonthString,
} from "@/src/utils/dates";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DAY_COLUMN_WIDTH = 50;

export default function GridScreen() {
  const {
    habits,
    entries,
    uiState,
    isHydrated,
    setHydrated,
    setHabits,
    setEntries,
    setUIState,
    setSelectedMonth,
    toggleActiveHabit,
    toggleCell,
    getEntryStatus,
    addHabit,
    renameHabit,
    deleteHabit,
    getActiveHabits,
  } = useHabitsStore();

  const [showHabitsModal, setShowHabitsModal] = useState(false);
  const headerScrollRef = React.useRef<ScrollView | null>(null);
  const rowScrollRefs = React.useRef<Record<string, ScrollView | null>>({});
  const scrollOffsetRef = React.useRef(0);
  const isSyncingRef = React.useRef(false);

  // Hydrate store on first mount
  useFocusEffect(
    useCallback(() => {
      if (!isHydrated) {
        (async () => {
          const loadedHabits = await storage.loadHabits();
          const loadedEntries = await storage.loadEntries();
          const loadedUIState = await storage.loadUIState();
          const loadedTrackingStartMonth =
            await storage.loadTrackingStartMonth();

          setHabits(loadedHabits);
          setEntries(loadedEntries);

          // Always default to current month, but preserve active habits and tracking start
          const currentMonth = monthDateToString(new Date());
          const trackingStartMonth = loadedTrackingStartMonth || currentMonth;

          // Save tracking start month if this is first launch
          if (!loadedTrackingStartMonth) {
            await storage.saveTrackingStartMonth(trackingStartMonth);
          }

          if (loadedUIState) {
            setUIState({
              selectedMonth: currentMonth,
              activeHabitIds: loadedUIState.activeHabitIds,
              trackingStartMonth,
            });
          } else {
            setUIState({
              selectedMonth: currentMonth,
              activeHabitIds: [],
              trackingStartMonth,
            });
          }

          setHydrated(true);
        })();
      }
    }, [
      isHydrated,
      setHabits,
      setEntries,
      setUIState,
      setSelectedMonth,
      setHydrated,
    ]),
  );

  // Persist habits, entries, and UI state when they change
  useEffect(() => {
    if (isHydrated) {
      storage.saveHabits(habits);
    }
  }, [habits, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      storage.saveEntries(entries);
    }
  }, [entries, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      storage.saveUIState(uiState);
    }
  }, [uiState, isHydrated]);

  const handleMonthChange = (month: Date) => {
    setSelectedMonth(monthDateToString(month));
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

  const registerHeaderScroll = (ref: ScrollView | null) => {
    headerScrollRef.current = ref;
    if (ref) {
      ref.scrollTo({ x: scrollOffsetRef.current, animated: false });
    }
  };

  const registerRowScroll = (rowKey: string, ref: ScrollView | null) => {
    if (!ref) {
      delete rowScrollRefs.current[rowKey];
      return;
    }

    rowScrollRefs.current[rowKey] = ref;
    ref.scrollTo({ x: scrollOffsetRef.current, animated: false });
  };

  const syncScroll = (sourceKey: string, offsetX: number) => {
    scrollOffsetRef.current = offsetX;

    if (sourceKey !== "header") {
      headerScrollRef.current?.scrollTo({ x: offsetX, animated: false });
    }

    Object.entries(rowScrollRefs.current).forEach(([key, ref]) => {
      if (key !== sourceKey) {
        ref?.scrollTo({ x: offsetX, animated: false });
      }
    });
  };

  const handleHeaderScroll = (offsetX: number) => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    syncScroll("header", offsetX);
    requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });
  };

  const handleRowScroll = (rowKey: string, offsetX: number) => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    syncScroll(rowKey, offsetX);
    requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });
  };

  const handleToggleCell = (dateKey: string, habitId: string) => {
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

  const activeHabits = getActiveHabits();
  const { year, month } = parseMonthString(uiState.selectedMonth);
  const currentMonthDate = monthStringToDate(uiState.selectedMonth);
  const trackingStartMonthDate = monthStringToDate(uiState.trackingStartMonth);
  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <SafeAreaView style={styles.container}>
      {/* Month Header */}
      <MonthHeader
        currentMonth={currentMonthDate}
        trackingStartMonth={trackingStartMonthDate}
        onMonthChange={handleMonthChange}
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

      {habits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyText}>No habits yet</Text>
          <Text style={styles.emptySubText}>
            Tap "Manage Habits" to add your first habit
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => setShowHabitsModal(true)}
          >
            <Text style={styles.emptyButtonText}>Add Your First Habit</Text>
          </TouchableOpacity>
        </View>
      ) : activeHabits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👀</Text>
          <Text style={styles.emptyText}>No habits selected</Text>
          <Text style={styles.emptySubText}>
            Open "Manage Habits" to select which habits to display
          </Text>
        </View>
      ) : (
        <View style={styles.gridContainer}>
          {/* Header Row */}
          <HabitHeaderRow
            habits={activeHabits}
            dayColumnWidth={DAY_COLUMN_WIDTH}
            onHorizontalScroll={handleHeaderScroll}
            registerScrollView={registerHeaderScroll}
            initialScrollX={scrollOffsetRef.current}
          />

          {/* Days List */}
          <FlatList
            data={days}
            keyExtractor={(day) => day.toString()}
            renderItem={({ item: day }) => {
              const dateKey = formatDateKey(year, month, day);
              return (
                <DayRow
                  day={day}
                  habits={activeHabits}
                  dateKey={dateKey}
                  getStatus={getEntryStatus}
                  onToggleCell={handleToggleCell}
                  dayColumnWidth={DAY_COLUMN_WIDTH}
                  onHorizontalScroll={(offset) =>
                    handleRowScroll(dateKey, offset)
                  }
                  registerScrollView={(ref) => registerRowScroll(dateKey, ref)}
                  initialScrollX={scrollOffsetRef.current}
                />
              );
            }}
          />
        </View>
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
  gridContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
