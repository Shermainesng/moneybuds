import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

type ExpenseItemProps = {
  expenseMemberID:string
  description:string
  amount: number
  username:string
}
export default function ExpensesListItem({ expenseMemberID, description, amount, username}: ExpenseItemProps) {
  //TODO: get Expense ID using the expenseMemberID
  console.log('description', description)
  return (
    <Link
      href={{
        pathname: "/friends/details",
        params: { expense_id: expenseMemberID }
      }}
      asChild
    >
      <Pressable className="bg-white my-1 py-3 px-3 rounded-sm">
        {/* <View>
          <Text className="text-base font-semibold mb-2">
            {expense.createdDate.slice(0, 2)} Dec | {expense.description}
          </Text>
        </View> */}

        <View className="flex-row justify-between">
          {amount < 0 ? (
            <Text className="text-gray-400">
              {username} paid for {description}
              You owe ${Math.abs(amount)} 
            </Text>

          ): (
            <Text className="text-gray-400">
            You paid for {description}
            {username} owes you ${Math.abs(amount)} 
          </Text>
          )}
        </View>
      </Pressable>
    </Link>
  );
}