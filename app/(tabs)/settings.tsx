import { useHabitsStore } from "@/src/store/habitsStore";
import React from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const clearAllData = useHabitsStore((state) => state.clearAllData);

  const handleClearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all habits and data? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            Alert.alert("Success", "All data has been cleared");
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <Text style={styles.appName}>Habit Tracker</Text>
            <Text style={styles.version}>Version 1.0.0</Text>
            <Text style={styles.description}>
              A clean, minimalist habit tracker to help you build better habits
              and track your progress.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <View style={styles.card}>
            <Text style={styles.infoText}>
              All your data is stored locally on your device. No cloud sync or
              account required.
            </Text>
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleClearAllData}
            >
              <Text style={styles.dangerButtonText}>Clear All Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Use</Text>
          <View style={styles.card}>
            <Text style={styles.instructionItem}>
              • Tap "Manage Habits" in Grid tab to add/edit habits
            </Text>
            <Text style={styles.instructionItem}>
              • Toggle habit visibility using checkboxes in the modal
            </Text>
            <Text style={styles.instructionItem}>
              • Tap cells to mark: empty → ✓ done → ✕ missed → empty
            </Text>
            <Text style={styles.instructionItem}>
              • Navigate months using the ‹ › buttons or month picker
            </Text>
            <Text style={styles.instructionItem}>
              • View your progress statistics in the Stats tab
            </Text>
          </View>
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
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  appName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: "#999",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  infoText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 16,
  },
  dangerButton: {
    backgroundColor: "#fee",
    borderWidth: 1,
    borderColor: "#ef4444",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  dangerButtonText: {
    color: "#dc2626",
    fontSize: 15,
    fontWeight: "600",
  },
  instructionItem: {
    fontSize: 15,
    color: "#666",
    lineHeight: 24,
    marginBottom: 8,
  },
});
