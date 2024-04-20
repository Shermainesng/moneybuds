import { Keyboard, TextInput, TouchableOpacity, View, Text, ActivityIndicator} from "react-native";
import ExpensesListItemDetails from '@/src/components/ExpensesListItemDetails'
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { GET_EXPENSE_DETAILS_BY_EXPENSEMEMBERID } from "../../../api/expenses/index"
import { useQuery } from "@apollo/client";
import React, {useState} from "react";
import { Expense } from "@/src/constants/type";

export default function ExpenseDetails() {
  //from expense member ID, get the expense ID, then get details of that expense 
  const {expenseMemberID} = useLocalSearchParams()
  console.log(expenseMemberID)

  const [expenseDetails, setExpenseDetails] = useState<Expense|null>(null)
  const {loading, error, data: getExpenseDetails} = useQuery(GET_EXPENSE_DETAILS_BY_EXPENSEMEMBERID, {
    variables: {expenseMemberId:expenseMemberID}, 
    fetchPolicy: 'no-cache',
    onCompleted: ({expenseDetailsByExpenseMemberId}) => {
              console.log(expenseDetailsByExpenseMemberId)
              setExpenseDetails({...expenseDetails, 
                id: expenseDetailsByExpenseMemberId.id,
                amount:expenseDetailsByExpenseMemberId.amount, 
                created_at: expenseDetailsByExpenseMemberId.created_at, 
                description: expenseDetailsByExpenseMemberId.description, 
                payer_id: expenseDetailsByExpenseMemberId.payer_id
              })
    }
});
 
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
      {loading && <ActivityIndicator size="large" color="blue" />}
      {!loading && <ExpensesListItemDetails expenseDetails={expenseDetails}/>}
    </View>
  );
}