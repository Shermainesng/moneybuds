import { Keyboard, TextInput, TouchableOpacity, View, Text } from "react-native";
import ExpensesListItemDetails from '@/src/components/ExpensesListItemDetails'
import { Link, Stack } from "expo-router";
import React from "react";

export default function ExpenseDetails() {
  return (
    <View className="flex-1 bg-pink-100 justify-center items-center">
      <Stack.Screen
        options={{
          headerTitle: "details",
          headerTintColor: "black",
          headerStyle: {
            backgroundColor: "#EDF76A"
          }
        }}
      />

      <ExpensesListItemDetails />
    </View>
  );
}