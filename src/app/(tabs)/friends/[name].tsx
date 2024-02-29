import { View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import ExpensesList from "@/src/components/ExpensesList"

export default function FriendsExpensesScreen() {
    const { name } = useLocalSearchParams();
  
    return (
      <View className="flex-1 bg-purple-300">
        <Stack.Screen
          options={{
            headerTitle: name as string,
            headerTintColor: "black",
            headerStyle: {
              backgroundColor: "#EDF76A"
            }
          }}
        />
  
        <View style={{ padding: 10 }}>
          <ExpensesList friendName={name} />
        </View>
      </View>
    );
  }