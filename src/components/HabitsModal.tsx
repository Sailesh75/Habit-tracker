import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Habit } from "../store/habitsStore";

interface HabitsModalProps {
  visible: boolean;
  onClose: () => void;
  habits: Habit[];
  activeHabitIds: string[];
  onAddHabit: (name: string) => void;
  onRenameHabit: (id: string, newName: string) => void;
  onDeleteHabit: (id: string) => void;
  onToggleActiveHabit: (habitId: string) => void;
}

export function HabitsModal({
  visible,
  onClose,
  habits,
  activeHabitIds,
  onAddHabit,
  onRenameHabit,
  onDeleteHabit,
  onToggleActiveHabit,
}: HabitsModalProps) {
  const [newHabitName, setNewHabitName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAdd = () => {
    const trimmed = newHabitName.trim();
    if (!trimmed) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }
    onAddHabit(trimmed);
    setNewHabitName("");
  };

  const startEditing = (habit: Habit) => {
    setEditingId(habit.id);
    setEditingName(habit.name);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const trimmed = editingName.trim();
    if (!trimmed) {
      Alert.alert("Error", "Habit name cannot be empty");
      return;
    }
    onRenameHabit(editingId, trimmed);
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = (habit: Habit) => {
    Alert.alert(
      "Delete Habit",
      `Are you sure you want to delete "${habit.name}"? All data for this habit will be lost.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteHabit(habit.id),
        },
      ],
    );
  };

  const activeSet = useMemo(() => new Set(activeHabitIds), [activeHabitIds]);

  const isActive = (habitId: string) => {
    return activeHabitIds.length === 0 || activeSet.has(habitId);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Manage Habits</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Add new habit */}
          <View style={styles.addSection}>
            <TextInput
              style={styles.input}
              placeholder="New habit name..."
              value={newHabitName}
              onChangeText={setNewHabitName}
              onSubmitEditing={handleAdd}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Habits list */}
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>
              Your Habits {habits.length > 0 && `(${habits.length})`}
            </Text>
            <Text style={styles.sectionSubtitle}>
              Tap to show/hide • Long press to edit • 🗑️ to delete
            </Text>
            {habits.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No habits yet</Text>
                <Text style={styles.emptySubtext}>
                  Add your first habit above
                </Text>
              </View>
            ) : (
              <FlatList
                data={habits}
                keyExtractor={(item) => item.id}
                extraData={{ activeHabitIds, editingId, editingName }}
                renderItem={({ item }) => {
                  const active = isActive(item.id);
                  const isEditing = editingId === item.id;

                  return (
                    <View style={styles.habitItem}>
                      <TouchableOpacity
                        style={styles.habitCheckbox}
                        onPress={() => onToggleActiveHabit(item.id)}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            active && styles.checkboxActive,
                          ]}
                        >
                          {active && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                      </TouchableOpacity>

                      {isEditing ? (
                        <View style={styles.editingContainer}>
                          <TextInput
                            style={styles.editInput}
                            value={editingName}
                            onChangeText={setEditingName}
                            autoFocus
                            onSubmitEditing={handleSaveEdit}
                            returnKeyType="done"
                          />
                          <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSaveEdit}
                          >
                            <Text style={styles.saveButtonText}>Save</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                              setEditingId(null);
                              setEditingName("");
                            }}
                          >
                            <Text style={styles.cancelButtonText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <>
                          <TouchableOpacity
                            style={styles.habitNameContainer}
                            onLongPress={() => startEditing(item)}
                          >
                            <Text
                              style={[
                                styles.habitName,
                                !active && styles.habitNameInactive,
                              ]}
                            >
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDelete(item)}
                          >
                            <Text style={styles.deleteButtonText}>🗑️</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  closeButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0066cc",
  },
  addSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: "#0066cc",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "300",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
  },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  habitCheckbox: {
    marginRight: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: "#d0d0d0",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#0066cc",
    borderColor: "#0066cc",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  habitNameContainer: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    color: "#333",
  },
  habitNameInactive: {
    color: "#999",
    textDecorationLine: "line-through",
  },
  deleteButton: {
    padding: 12,
    marginLeft: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    fontSize: 22,
  },
  editingContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#0066cc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#0066cc",
    borderRadius: 6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    fontSize: 18,
    color: "#999",
  },
});
