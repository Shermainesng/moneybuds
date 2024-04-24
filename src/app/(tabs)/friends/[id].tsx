import {useEffect, useState} from 'react'
import { View, Text, Pressable} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@apollo/client";
import { GET_EXPENSE_MEMBERS_BY_EXPENSEID } from "@/src/api/expenses";
import { ExpenseMember } from "@/src/constants/type";
import { useAuth } from '@/src/providers/AuthProvider';
import { ActivityIndicator } from 'react-native-paper';
import ExpensesListItem from '@/src/components/ExpensesListItem';
import { Link } from "expo-router";

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
    const [groupOwesMe, setGroupOwesMe] = useState<number>(0)

    const {loading: getExpenseMembersLoading, error: getExpenseMembersError, data: getExpenseMembers} = useQuery(GET_EXPENSE_MEMBERS_BY_EXPENSEID, {
      variables: {userId:id, expenseId: null}, 
      fetchPolicy: 'no-cache',
      onCompleted: ({expenseMembersByExpenseIds}) => {
              if (expenseMembersByExpenseIds.length>0) {
                //filter only those expenses where only both friend and I are involved
                const filtered = expenseMembersByExpenseIds.filter((expense:ExpenseMember)=> (expense.expense_id.payer_id.id === id && expense.member_id.id === userId) || (expense.expense_id.payer_id.id === userId && expense.member_id.id === id))
                // console.log("filtered expenses", filtered)
                setExpenses(filtered)
                setIsFetchComplete(true)
              }
          }
  });

      useEffect(()=> {
        if (isFetchComplete) {
          overallAmtOwedInGroup()
        }
      }, [isFetchComplete])

      const overallAmtOwedInGroup = () => {
        //get the objects where group_id is not null
        const groupExpenses = expenses.filter((expense)=> 
          expense.expense_id.group_id !== null
        )
        let groupOwesUser = 0
        console.log("group transact", groupExpenses)
        groupExpenses.map((grpExpense) => {
          if (grpExpense.member_id.id === userId) {
            if (grpExpense.owes > 0) {
              console.log("owes", grpExpense.owes)
              groupOwesUser -= grpExpense.owes
            } else if (grpExpense.isOwed > 0){
              console.log("isOwed", grpExpense.isOwed)
              groupOwesUser += grpExpense.isOwed
            }
          } else { //friend owes me
            if (grpExpense.owes > 0) {
              console.log("owes", grpExpense.owes)
              groupOwesUser += grpExpense.owes
            } else if (grpExpense.isOwed > 0){
              console.log("isOwed", grpExpense.isOwed)
              groupOwesUser -= grpExpense.isOwed
            }
          }
        })
        console.log("overall for group", groupOwesUser) //should be -2
        setGroupOwesMe(groupOwesUser)
        setDisplayData()
        //get those data where member_id is me, add up isOwed and minus owes
      }

      //{"113": ['acai', 2], "111": ['fried',-3]]}
      const setDisplayData = ()=> {
        //remove group expenses from expenses
        const noGroupExpenses = expenses.filter((expense)=> 
          expense.expense_id.group_id === null
        )
        const currentExpenses: Record<string, expenseInfo> = {}
        noGroupExpenses.map((noGroupExpenses)=> {
          //i was the payer
          if (noGroupExpenses.expense_id.payer_id.id === userId) {
            currentExpenses[noGroupExpenses.id] = [noGroupExpenses.expense_id.description, noGroupExpenses.owes]
          } else {
            //friend paid
            currentExpenses[noGroupExpenses.id] = [noGroupExpenses.expense_id.description, -noGroupExpenses.owes]
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


        <Pressable className="bg-white my-1 py-3 px-3 rounded-sm">
          <View className="flex-row">
            <Text className="text-gray-400">Group Expenses:</Text>
            {groupOwesMe !== 0 && groupOwesMe>0 ? <Text>{name} owes you ${groupOwesMe}</Text>:<Text>You owe {name} ${Math.abs(groupOwesMe)}</Text>}
          </View>
        </Pressable>
      </View>
    </View>
      );
    }