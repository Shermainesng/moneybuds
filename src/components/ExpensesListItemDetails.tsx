import { StyleSheet, View, Text, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

import { expenses } from "@/src/constants/Data"

export default function ExpensesListItemDetails() {
  const { expense_id } = useLocalSearchParams();

  const expense = expenses.find(expense => {
    if (expense.id.toString() == expense_id) return expense;
  });

  return (
    <View className="bg-white w-[70vw] px-6 py-5 rounded-xl border">
      <View className="mb-10 w-full border-b-[1px] pb-2">
        <Text className="text-xl font-semibold">{expense?.description}</Text>
        <Text className="text-lg">07 February 2024</Text>
      </View>

      <View className="gap-y-1">
        <Text className="text-base">Paid by: {expense?.paid_by}</Text>
        <Text className="text-base">Amount: ${expense?.amount_paid}</Text>
        <Text className="text-base">Owed by: {expense?.owed_by}</Text>
        <Text className="text-base">Amount: ${expense?.amount_owed}</Text>
      </View>
    </View>
  );
}