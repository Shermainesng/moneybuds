import { StyleSheet, View, Text, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import React, {useState} from "react";
import { Expense, ExpenseMember, User } from "../constants/type";
import { useLocalSearchParams } from "expo-router";
import { GET_EXPENSE_MEMBERS_BY_EXPENSEID } from "../api/expenses";
import { useQuery } from "@apollo/client";

interface ExpensesListItemDetailsProps {
  expenseDetails: Expense | null;
}

export default function ExpensesListItemDetails({expenseDetails}: ExpensesListItemDetailsProps) {
  console.log("payer id in details list", expenseDetails?.payer_id.id)
  const [membersInvolved, setMembersInvolved] = useState<User[]>([])

  //get others involved in expense: get other expense members involved in this transaction, filter out payer 
  const {loading, error, data}= useQuery(GET_EXPENSE_MEMBERS_BY_EXPENSEID, {
    variables: {userId: null, expenseId: expenseDetails?.id}, 
    fetchPolicy: 'no-cache',
    onCompleted: ({expenseMembersByExpenseIds}) => {
      const membersExcludePayer =  expenseMembersByExpenseIds.filter(
        (member:ExpenseMember)=> member.member_id.id !== expenseDetails?.payer_id.id
        ).map((member:ExpenseMember) => member.member_id as User);
      console.log("exclude payer", membersExcludePayer)
      setMembersInvolved(membersExcludePayer)
    }
  })

  return (
    <View className="bg-white w-[70vw] px-6 py-5 rounded-xl border">
      {loading && <ActivityIndicator size="large" color="blue" />}
      <View className="mb-10 w-full border-b-[1px] pb-2">
        <Text className="text-xl font-semibold">{expenseDetails?.description}</Text>
        {/* TODO: convert created_at to dd/mm/yy fo  rmat */}
        <Text className="text-lg">{expenseDetails?.created_at}</Text> 

      </View>

      <View className="gap-y-1">
        <Text className="text-base">Paid by: {expenseDetails?.payer_id.username}</Text>
        <Text className="text-base">Amount: ${expenseDetails?.amount}</Text>
        <Text>Friends Involved:</Text>
        {membersInvolved.length>0 && membersInvolved.map((member)=> (
          <Text key={member.id}>{member.username}</Text>
        ))}
      </View>
    </View>
  );
}