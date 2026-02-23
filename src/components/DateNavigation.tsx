import { addDays, format, subDays } from "date-fns";
import React, { useMemo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DateNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onOpenCalendar: () => void;
}

export function DateNavigation({
  selectedDate,
  onDateChange,
  onOpenCalendar,
}: DateNavigationProps) {
  const dateLabel = useMemo(
    () => format(selectedDate, "EEE, MMM d"),
    [selectedDate],
  );

  const handlePrevious = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNext = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  return (
    <View style={styles.container}>
      {/* Previous Day Button */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={handlePrevious}
        activeOpacity={0.7}
      >
        <Text style={styles.navButtonText}>←</Text>
      </TouchableOpacity>

      {/* Center Date Display */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={onOpenCalendar}
        activeOpacity={0.7}
      >
        <Text style={styles.dateText}>{dateLabel}</Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>

      {/* Next Day Button */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={handleNext}
        activeOpacity={0.7}
      >
        <Text style={styles.navButtonText}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  navButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "#f5f5f5",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  navButtonText: {
    fontSize: 24,
    color: "#333",
    fontWeight: "600",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    minWidth: 180,
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  calendarIcon: {
    fontSize: 16,
  },
});
