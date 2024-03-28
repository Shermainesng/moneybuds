import { View, Text, Pressable, FlatList, ActivityIndicator} from "react-native";
import {useState, useEffect} from 'react'
import { Link, Stack } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
// import { useFriendIDs } from "@/src/api/friends";
// import { useFetchFriendList } from "@/src/api/friends";
import { useGetFriendsList, useGetFriendsProfiles } from "@/src/api/friends";
import FriendsListItem from "@/src/components/FriendsListItem";
import { useAuth } from "@/src/providers/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_EXPENSE_IDS, GET_EXPENSE_MEMBERS_BY_EXPENSEID } from "@/src/api/expenses";
import { ExpenseMember, User } from "@/src/constants/type";
import { client } from "../../_layout";


export default function FriendsScreen() {
    const {session} = useAuth()
    const userId = session?.user.id
    // const [expenseIDs, setExpenseIDs] = useState<String[]>([])
    const [expenseMembers, setExpenseMembers] = useState<ExpenseMember[]>()
    const amountsOwedToFriend: Record<string, number> = {}; //define the type of this object 
    const amountsOwedByFriend: Record<string, number> = {}
    const overallAmtsOwed: Record<string, number> = {}
    
    const {loading: getExpenseIDsLoading, error: getExpenseIDsError, data: getExpenseIDs} = useQuery(GET_EXPENSE_IDS, {
        variables: {id:userId}
    });

    //getting expense IDs for expenses where user is a part of 
    useEffect(() => {
        const fetchExpenseMembers = async()=> {
            if (getExpenseIDs && getExpenseIDs.expenseMembersByUserId) { // Check for both data and property
                const expenseIds = getExpenseIDs.expenseMembersByUserId || [];
                // console.log("array of IDs", expenseIds)
                try {
                    const { data } = await client.query({
                        query: GET_EXPENSE_MEMBERS_BY_EXPENSEID,
                        variables: { expense_ids: expenseIds, user_id: userId }
                    });
                    if (data && data.expenseMembersByExpenseIds) {
                        // console.log("Expense members for expense ID", ":", data.expenseMembersByExpenseIds);
                        setExpenseMembers(data.expenseMembersByExpenseIds)
                    }
                } catch (error) {
                    console.error("Error fetching expense members:", error);
                }
            }
        }
        fetchExpenseMembers()
      }, [getExpenseIDs]);

      useEffect(() => {
        if (expenseMembers && expenseMembers.length>0) {
            // console.log("expense members set:", expenseMembers)
            calculateSplitExpenses()
        }
      }, [expenseMembers])

      const calculateSplitExpenses = () => {
        console.log("reached calculate split expenses")
        
        expenseMembers?.forEach((expenseMember) => {
            const memberIdString = JSON.stringify(expenseMember.member_id);
            console.log(memberIdString)
            //friend is owed the amount
            if (expenseMember.isOwed > 0) { 
                if (!amountsOwedToFriend[memberIdString]) {
                    amountsOwedToFriend[memberIdString] = 0;
                } 
                amountsOwedToFriend[memberIdString] += expenseMember.isOwed
            }
            //friend owes me the amount
            if (expenseMember.owes > 0){
                if (!amountsOwedByFriend[memberIdString]) {
                    amountsOwedByFriend[memberIdString] = 0
                }
                amountsOwedByFriend[memberIdString] += expenseMember.owes
            }
        })
        // console.log(amountsOwedToFriend)
        // console.log(amountsOwedByFriend)
        calculateOverallAmtOwes()
      }

      const calculateOverallAmtOwes = () => {
        Object.keys(amountsOwedToFriend).forEach((friend) => {
            const amountOwedToYou = amountsOwedByFriend[friend] || 0
            const amountYouOwe = amountsOwedToFriend[friend] || 0
            overallAmtsOwed[friend] = amountOwedToYou - amountYouOwe //overall amt that each person owes me 
        })
        console.log("overall oweing", overallAmtsOwed)
      }

      //iterate over overallAmtsOwed and pass each to <friend> component
    return (
        <View className="flex-1 bg-purple-300">
            
            {/* <FlatList data={friends} renderItem={({ item }) => <FriendsListItem item={item} />} onEndReachedThreshold={1} contentInsetAdjustmentBehavior="automatic" /> */}

            <Link href="/add-expense/" asChild>
            <Pressable className="border border-black rounded-full bg-[#EDF76A] absolute bottom-[2px] p-2 right-[41vw] z-50">
            <Ionicons name="add" size={35} color="black" />
            </Pressable>
            </Link> 
            <View className="border border-black rounded-full bg-black absolute bottom-[0px] p-2 right-[40vw] z-40">
                <Ionicons name="add" size={35} color="black" />
            </View>
        </View>
    )
} 