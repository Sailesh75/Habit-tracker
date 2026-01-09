import React from "react";
import { Text, View } from "react-native";

interface CellProps {
  // Add props
}

export const Cell: React.FC<CellProps> = () => {
  return (
    <View>
      <Text>Cell Component</Text>
    </View>
  );
};
