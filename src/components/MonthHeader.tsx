import { addMonths, format, subMonths } from "date-fns";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getMonthPickerOptions, monthStringToDate } from "../utils/dates";

interface MonthHeaderProps {
  currentMonth: Date; // first day of month
  trackingStartMonth: Date; // first month user started tracking
  onMonthChange: (month: Date) => void;
}

export function MonthHeader({
  currentMonth,
  trackingStartMonth,
  onMonthChange,
}: MonthHeaderProps) {
  const [showPicker, setShowPicker] = useState(false);

  const monthLabel = useMemo(
    () => format(currentMonth, "MMMM yyyy"),
    [currentMonth],
  );
  const currentMonthKey = useMemo(
    () => format(currentMonth, "yyyy-MM-01"),
    [currentMonth],
  );
  const monthOptions = useMemo(
    () => getMonthPickerOptions(currentMonth, trackingStartMonth, 1),
    [currentMonth, trackingStartMonth],
  );

  const isAtStart = useMemo(() => {
    return (
      format(currentMonth, "yyyy-MM") === format(trackingStartMonth, "yyyy-MM")
    );
  }, [currentMonth, trackingStartMonth]);

  const handlePrevious = () => {
    if (!isAtStart) {
      onMonthChange(subMonths(currentMonth, 1));
    }
  };

  const handleNext = () => {
    onMonthChange(addMonths(currentMonth, 1));
  };

  const handleSelectMonth = (value: string) => {
    onMonthChange(monthStringToDate(value));
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.navButton, isAtStart && styles.navButtonDisabled]}
        onPress={handlePrevious}
        disabled={isAtStart}
      >
        <Text
          style={[
            styles.navButtonText,
            isAtStart && styles.navButtonTextDisabled,
          ]}
        >
          ‹
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.monthButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.monthText}>{monthLabel}</Text>
        <Text style={styles.dropdownIcon}>▾</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navButton} onPress={handleNext}>
        <Text style={styles.navButtonText}>›</Text>
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Month</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={monthOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.pickerItem,
                    item.value === currentMonthKey && styles.pickerItemSelected,
                  ]}
                  onPress={() => handleSelectMonth(item.value)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      item.value === currentMonthKey &&
                        styles.pickerItemTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
  },
  navButtonDisabled: {
    backgroundColor: "#f9f9f9",
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 28,
    color: "#333",
    fontWeight: "600",
  },
  navButtonTextDisabled: {
    color: "#ccc",
  },
  monthButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    minWidth: 180,
    justifyContent: "center",
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  dropdownIcon: {
    fontSize: 14,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    fontSize: 24,
    color: "#666",
    fontWeight: "300",
  },
  pickerItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  pickerItemSelected: {
    backgroundColor: "#f0f9ff",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#333",
  },
  pickerItemTextSelected: {
    fontWeight: "600",
    color: "#0066cc",
  },
});
