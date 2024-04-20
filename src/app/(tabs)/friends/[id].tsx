import {useEffect, useState} from 'react'
import { View, Text} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@apollo/client";
import { GET_EXPENSE_MEMBERS_BY_EXPENSEID } from "@/src/api/expenses";
import { ExpenseMember } from "@/src/constants/type";
import { useAuth } from '@/src/providers/AuthProvider';
import { ActivityIndicator } from 'react-native-paper';
import ExpensesListItem from '@/src/components/ExpensesListItem';

export default function FriendsExpensesScreen() {
  const {session} = useAuth()
  const userId = session?.user.id
    const { id, name} = useLocalSearchParams();
    id !== null ? parseInt(typeof id === 'string' ? id : id[0]) : null;
    const username = name !== null ? typeof name === 'string' ? name : name[0]:'undefined'
    const [expenses, setExpenses] = useState<ExpenseMember[]>([])
    const [isFetchComplete, setIsFetchComplete] = useState<boolean>(false)
    type expenseInfo = [string, number]
    // const friendIsOwed: Record<string, expenseInfo[]> = {}
    const [expenseInfos, setExpenseInfos] = useState<Record<string, expenseInfo>>({});

    const {loading: getExpenseMembersLoading, error: getExpenseMembersError, data: getExpenseMembers} = useQuery(GET_EXPENSE_MEMBERS_BY_EXPENSEID, {
      variables: {userId:id, expenseId: null}, 
      fetchPolicy: 'no-cache',
      onCompleted: ({expenseMembersByExpenseIds}) => {
              if (expenseMembersByExpenseIds.length>0) {
                // console.log("expenses here", expenseMembersByExpenseIds)
                //filter only those expenses where only both I and Dini are involved
                const filtered = expenseMembersByExpenseIds.filter((expense:ExpenseMember)=> (expense.expense_id.payer_id.id === id && expense.member_id.id === userId) || (expense.expense_id.payer_id.id === userId && expense.member_id.id === id))
                // console.log("filtered expenses", filtered)
                setExpenses(filtered)
                setIsFetchComplete(true)
              }
          }
  });

      useEffect(()=> {
        if (isFetchComplete) {
          setDisplayData()
        }
      }, [isFetchComplete])

      //{"113": ['acai', 2], "111": ['fried',-3]]}
      const setDisplayData = ()=> {
        const currentExpenses: Record<string, expenseInfo> = {}
        expenses.map((expense)=> {
          //i was the payer
          if (expense.expense_id.payer_id.id === userId) {
            currentExpenses[expense.id] = [expense.expense_id.description, expense.owes]
          } else {
            //friend paid
            currentExpenses[expense.id] = [expense.expense_id.description, -expense.owes]
          }
        })
        setExpenseInfos(currentExpenses)
        console.log("frend owes me",currentExpenses)
      }

    return (
      <View className="flex-1 bg-purple-300">
        {getExpenseMembersLoading && <ActivityIndicator size="large" color="blue" />}
        <Stack.Screen
          options={{
            headerTitle: name as string,
            headerTintColor: "black",
            headerStyle: {
              backgroundColor: "#EDF76A"
            }
          }}
        />

        {/* [['113': ['acai',2]], ['111', ['fried',-3]]] */}
        <View style={{ padding: 10 }}>
        <Text>Click for more details</Text>
        {expenseInfos && Object.entries(expenseInfos).map(([key, value]) => (
            <ExpensesListItem key={key} expenseMemberID={key} description={value[0]} amount={value[1]} username={username}/>
        ))}
  </View>
        </View>
      );
    }