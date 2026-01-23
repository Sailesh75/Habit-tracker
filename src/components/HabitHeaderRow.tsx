import React, { useRef } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Habit } from "../store/habitsStore";

interface HabitHeaderRowProps {
  habits: Habit[];
  dayColumnWidth: number;
  onHorizontalScroll?: (offsetX: number) => void;
  registerScrollView?: (ref: ScrollView | null) => void;
  initialScrollX?: number;
}

const HABIT_COLUMN_WIDTH = 110;

export function HabitHeaderRow({
  habits,
  dayColumnWidth,
  onHorizontalScroll,
  registerScrollView,
  initialScrollX = 0,
}: HabitHeaderRowProps) {
  const scrollViewRef = useRef<ScrollView>(null);

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

  const showFullName = (name: string) => {
    Alert.alert("Habit Name", name);
  };

  return (
    <View style={styles.container}>
      {/* Fixed left column for "Day" */}
      <View style={[styles.dayHeader, { width: dayColumnWidth }]}>
        <Text style={styles.dayHeaderText}>Day</Text>
      </View>

      {/* Scrollable habits */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {habits.map((habit) => (
          <TouchableOpacity
            key={habit.id}
            style={[styles.habitColumn, { width: HABIT_COLUMN_WIDTH }]}
            onLongPress={() => showFullName(habit.name)}
          >
            <Text
              style={styles.habitText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {habit.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderBottomWidth: 2,
    borderBottomColor: "#e0e0e0",
  },
  dayHeader: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  dayHeaderText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  habitColumn: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  habitText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
