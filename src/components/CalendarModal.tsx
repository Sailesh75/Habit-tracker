import { format, parse } from "date-fns";
import React, { useMemo } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

interface CalendarModalProps {
  visible: boolean;
  selectedDate: Date;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}

export function CalendarModal({
  visible,
  selectedDate,
  onClose,
  onSelectDate,
}: CalendarModalProps) {
  const selectedDateString = useMemo(
    () => format(selectedDate, "yyyy-MM-dd"),
    [selectedDate],
  );

  const markedDates = useMemo(
    () => ({
      [selectedDateString]: {
        selected: true,
        selectedColor: "#0066cc",
      },
    }),
    [selectedDateString],
  );

  const handleDayPress = (day: { dateString: string }) => {
    // Parse date safely to avoid timezone issues
    // date-fns parse ensures we get a local date, not UTC
    const newDate = parse(day.dateString, "yyyy-MM-dd", new Date());
    console.log(
      "📅 Calendar selected:",
      day.dateString,
      "-> Date object:",
      newDate,
    );
    onSelectDate(newDate);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Date</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar */}
          <Calendar
            current={selectedDateString}
            markedDates={markedDates}
            onDayPress={handleDayPress}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#666",
              selectedDayBackgroundColor: "#0066cc",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#0066cc",
              dayTextColor: "#333",
              textDisabledColor: "#d9d9d9",
              dotColor: "#0066cc",
              selectedDotColor: "#ffffff",
              arrowColor: "#0066cc",
              monthTextColor: "#333",
              indicatorColor: "#0066cc",
              textDayFontWeight: "400",
              textMonthFontWeight: "600",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            enableSwipeMonths
            style={styles.calendar}
          />

          {/* Today Button */}
          <TouchableOpacity
            style={styles.todayButton}
            onPress={() => {
              onSelectDate(new Date());
              onClose();
            }}
          >
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    maxHeight: "60%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
    fontWeight: "300",
  },
  calendar: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  todayButton: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: "#0066cc",
    borderRadius: 12,
    alignItems: "center",
  },
  todayButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
