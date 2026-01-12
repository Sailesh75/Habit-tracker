import { storage } from "@/src/storage/storage";
import { useHabitsStore } from "@/src/store/habitsStore";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HabitsScreen() {
  const { habits, isHydrated, setHydrated, setHabits, addHabit, deleteHabit } =
    useHabitsStore();
  const [newHabitName, setNewHabitName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hydrate store on screen focus
  useFocusEffect(
    React.useCallback(() => {
      if (!isHydrated) {
        (async () => {
          const loadedHabits = await storage.loadHabits();
          setHabits(loadedHabits);
          setHydrated(true);
        })();
      }
    }, [isHydrated, setHabits, setHydrated])
  );

  const handleAddHabit = async () => {
    const trimmed = newHabitName.trim();
    if (!trimmed) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }

    setIsLoading(true);
    addHabit(trimmed);
    await storage.saveHabits(
      habits.concat({
        id: `habit_${Date.now()}`,
        name: trimmed,
        order: habits.length,
      })
    );
    setNewHabitName("");
    setIsLoading(false);
  };

  const handleDeleteHabit = (habitId: string) => {
    Alert.alert("Delete Habit", "Are you sure?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: async () => {
          deleteHabit(habitId);
          const updatedHabits = habits.filter((h) => h.id !== habitId);
          await storage.saveHabits(updatedHabits);
        },
        style: "destructive",
      },
    ]);
  };

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Manage Habits</Text>

      {/* Add Habit Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter habit name..."
          value={newHabitName}
          onChangeText={setNewHabitName}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.addButton, isLoading && styles.addButtonDisabled]}
          onPress={handleAddHabit}
          disabled={isLoading}
        >
          <Text style={styles.addButtonText}>{isLoading ? "..." : "Add"}</Text>
        </TouchableOpacity>
      </View>

      {/* Habits List */}
      {habits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No habits yet. Create one above!</Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(habit) => habit.id}
          renderItem={({ item: habit }) => (
            <View style={styles.habitItem}>
              <Text style={styles.habitName}>{habit.name}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteHabit(habit.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#ccc",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },
  habitItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  habitName: {
    fontSize: 16,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});
