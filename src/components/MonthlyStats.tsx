import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CellStatus, Habit } from "../store/habitsStore";
import { computeMonthStats } from "../utils/stats";

interface MonthlyStatsProps {
  year: number;
  month: number; // 0-indexed
  habits: Habit[];
  entries: Record<string, CellStatus>;
}

const GREEN = "#10b981";
const RED = "#ef4444";
const TRACK = "#f0f0f0";

export function MonthlyStats({
  year,
  month,
  habits,
  entries,
}: MonthlyStatsProps) {
  const stats = useMemo(
    () => computeMonthStats(year, month, habits, entries),
    [year, month, habits, entries],
  );

  if (stats.isFuture) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderIcon}>📅</Text>
        <Text style={styles.placeholderText}>This month hasn’t started yet</Text>
        <Text style={styles.placeholderSub}>
          Come back during the month to see your progress.
        </Text>
      </View>
    );
  }

  const pct = Math.round(stats.completionRate * 100);
  const remaining = Math.max(0, stats.possible - stats.doneCount - stats.missedCount);
  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.total));

  return (
    <View style={styles.container}>
      {/* 1. Overall completion */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Month</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.bigPct}>{pct}%</Text>
          <Text style={styles.bigPctLabel}>completed</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
        <View style={styles.legendRow}>
          <Legend color={GREEN} label="Done" value={stats.doneCount} />
          <Legend color={RED} label="Missed" value={stats.missedCount} />
          <Legend color="#cbd5e1" label="Remaining" value={remaining} />
        </View>
        <Text style={styles.summaryFootnote}>
          {stats.doneCount} of {stats.possible} habit-days completed over{" "}
          {stats.elapsedDays} day{stats.elapsedDays === 1 ? "" : "s"}
        </Text>
      </View>

      {/* 2. Per-habit progress */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>By Habit</Text>
        {stats.perHabit.map(({ habit, doneCount, rate }) => {
          const habitPct = Math.round(rate * 100);
          return (
            <View key={habit.id} style={styles.habitRow}>
              <View style={styles.habitLabelRow}>
                <Text style={styles.habitName} numberOfLines={1}>
                  {habit.name}
                </Text>
                <Text style={styles.habitPct}>{habitPct}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${habitPct}%` }]}
                />
              </View>
              <Text style={styles.habitSub}>
                {doneCount}/{stats.elapsedDays} days
              </Text>
            </View>
          );
        })}
      </View>

      {/* 3. Streaks */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Streaks</Text>
        {stats.perHabit.map(({ habit, currentStreak, longestStreak }) => (
          <View key={habit.id} style={styles.streakRow}>
            <Text style={styles.habitName} numberOfLines={1}>
              {habit.name}
            </Text>
            <View style={styles.streakValues}>
              <View style={styles.streakBadge}>
                <Text style={styles.streakNumber}>
                  {currentStreak > 0 ? `🔥 ${currentStreak}` : "—"}
                </Text>
                <Text style={styles.streakCaption}>current</Text>
              </View>
              <View style={styles.streakBadge}>
                <Text style={styles.streakNumber}>{longestStreak}</Text>
                <Text style={styles.streakCaption}>best</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 4. Daily trend */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Trend</Text>
        <Text style={styles.cardSubtitle}>
          Habits completed each day ({stats.totalHabits} tracked)
        </Text>
        <View style={styles.chart}>
          {stats.daily.map((d) => {
            const heightPct = d.isElapsed ? (d.done / maxDaily) * 100 : 0;
            return (
              <View key={d.day} style={styles.chartColumn}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${heightPct}%`,
                        backgroundColor: d.done > 0 ? GREEN : "transparent",
                      },
                    ]}
                  />
                </View>
                {d.day % 5 === 0 ? (
                  <Text style={styles.chartLabel}>{d.day}</Text>
                ) : (
                  <Text style={styles.chartLabel}> </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function Legend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendValue}>{value}</Text>
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#999",
    marginTop: -8,
    marginBottom: 16,
  },
  // Summary
  summaryRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  bigPct: {
    fontSize: 44,
    fontWeight: "800",
    color: GREEN,
  },
  bigPctLabel: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
    fontWeight: "500",
  },
  progressTrack: {
    height: 10,
    backgroundColor: TRACK,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: GREEN,
    borderRadius: 5,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginRight: 4,
  },
  legendLabel: {
    fontSize: 13,
    color: "#888",
  },
  summaryFootnote: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 14,
  },
  // Per-habit
  habitRow: {
    marginBottom: 16,
  },
  habitLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  habitName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    flex: 1,
    marginRight: 12,
  },
  habitPct: {
    fontSize: 14,
    fontWeight: "700",
    color: GREEN,
  },
  habitSub: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
  },
  // Streaks
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  streakValues: {
    flexDirection: "row",
    gap: 20,
  },
  streakBadge: {
    alignItems: "center",
    minWidth: 48,
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  streakCaption: {
    fontSize: 11,
    color: "#aaa",
    marginTop: 2,
  },
  // Chart
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 120,
    gap: 2,
  },
  chartColumn: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  barTrack: {
    width: "100%",
    flex: 1,
    backgroundColor: "#f7f7f7",
    borderRadius: 3,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bar: {
    width: "100%",
    borderRadius: 3,
    minHeight: 2,
  },
  chartLabel: {
    fontSize: 9,
    color: "#bbb",
    marginTop: 4,
  },
  // Future placeholder
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
  },
  placeholderIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  placeholderSub: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
