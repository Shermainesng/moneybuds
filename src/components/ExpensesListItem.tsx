import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function ExpensesListItem({ expense }: any) {
  return (
    <Link
      href={{
        pathname: "/friends/details",
        params: { expense_id: expense.id }
      }}
      asChild
    >
      <Pressable className="bg-white my-1 py-3 px-3 rounded-sm">
        <View>
          <Text className="text-base font-semibold mb-2">
            {expense.createdDate.slice(0, 2)} Dec | {expense.description}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-gray-400">
            {expense.paid_by} paid ${expense.amount_paid}
          </Text>
          <Text className="text-gray-400">
            {expense.owed_by} owes ${expense.amount_owed}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}