import React, { useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CellStatus, Habit } from "../store/habitsStore";

interface CellProps {
  status: CellStatus;
  onPress: () => void;
}

function Cell({ status, onPress }: CellProps) {
  const getContent = () => {
    switch (status) {
      case 1:
        return { text: "✓", color: "#10b981" };
      case 2:
        return { text: "✕", color: "#ef4444" };
      default:
        return { text: "", color: "#e5e5e5" };
    }
  };

  const { text, color } = getContent();

  return (
    <TouchableOpacity
      style={[styles.cell, { borderColor: color }]}
      onPress={onPress}
    >
      {text ? <Text style={[styles.cellText, { color }]}>{text}</Text> : null}
    </TouchableOpacity>
  );
}

interface DayRowProps {
  day: number;
  habits: Habit[];
  dateKey: string;
  getStatus: (dateKey: string, habitId: string) => CellStatus;
  onToggleCell: (dateKey: string, habitId: string) => void;
  dayColumnWidth: number;
  onHorizontalScroll?: (offsetX: number) => void;
  registerScrollView?: (ref: ScrollView | null) => void;
  initialScrollX?: number;
}

const HABIT_COLUMN_WIDTH = 110;

export function DayRow({
  day,
  habits,
  dateKey,
  getStatus,
  onToggleCell,
  dayColumnWidth,
  onHorizontalScroll,
  registerScrollView,
  initialScrollX = 0,
}: DayRowProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  // Debug: Log when component mounts to verify React is creating separate instances
  React.useEffect(() => {
    console.log(`🆕 DayRow mounted - Day ${day}, dateKey: "${dateKey}"`);
    return () => {
      console.log(`💀 DayRow unmounted - Day ${day}, dateKey: "${dateKey}"`);
    };
  }, [day, dateKey]);

  React.useEffect(() => {
    if (registerScrollView) {
      registerScrollView(scrollViewRef.current);
      return () => registerScrollView(null);
    }
  }, [registerScrollView]);

  React.useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: initialScrollX, animated: false });
    }
  }, [initialScrollX]);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    if (onHorizontalScroll) {
      onHorizontalScroll(offsetX);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed left column for day number */}
      <View style={[styles.dayCell, { width: dayColumnWidth }]}>
        <Text style={styles.dayText}>{day}</Text>
      </View>

      {/* Scrollable cells */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {habits.map((habit) => {
          const status = getStatus(dateKey, habit.id);
          // Log every cell's status to see what's actually being rendered
          if (status !== 0) {
            console.log(
              `📱 Rendering cell - Day ${day}, dateKey: "${dateKey}", habitId: ${habit.id}, status: ${status}`,
            );
          }
          return (
            <View key={habit.id} style={{ width: HABIT_COLUMN_WIDTH }}>
              <Cell
                status={status}
                onPress={() => {
                  console.log(
                    `🎯 DayRow cell clicked - Day: ${day}, dateKey: "${dateKey}", habitId: ${habit.id}`,
                  );
                  onToggleCell(dateKey, habit.id);
                }}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  dayCell: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#fafafa",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  cell: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: "#fff",
    margin: 8,
    marginLeft: 33, // Center the cell within the 110px column
  },
  cellText: {
    fontSize: 24,
    fontWeight: "600",
  },
});
