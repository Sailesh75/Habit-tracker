import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { CellStatus } from "../store/habitsStore";

interface CellProps {
  status: CellStatus;
  onPress: () => void;
  size?: number;
}

const DEFAULT_SIZE = 40;
const BORDER_COLOR = "#ccc";
const EMPTY_BG = "#fff";
const DONE_BG = "#d4edda";
const MISSED_BG = "#f8d7da";
const BORDER_WIDTH = 1;

export function Cell({ status, onPress, size = DEFAULT_SIZE }: CellProps) {
  const backgroundColor =
    status === 0 ? EMPTY_BG : status === 1 ? DONE_BG : MISSED_BG;

  const statusText = status === 0 ? "" : status === 1 ? "✅" : "❌";

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor,
          borderColor: BORDER_COLOR,
          borderWidth: BORDER_WIDTH,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { fontSize: size * 0.5 }]}>{statusText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
  },
});
