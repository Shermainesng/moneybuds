import { View, Text, Pressable, FlatList, ActivityIndicator} from "react-native";
import {useState, useEffect} from 'react'
import { Link, Stack } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
// import { useFriendIDs } from "@/src/api/friends";
// import { useFetchFriendList } from "@/src/api/friends";
import FriendsListItem from "@/src/components/FriendsListItem";
import { useAuth } from "@/src/providers/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_EXPENSE_MEMBERS_BY_EXPENSEID } from "@/src/api/expenses";
import { ExpenseMember, User, FriendExpense } from "@/src/constants/type";
import { client } from "../../_layout";


export default function FriendsScreen() {
    const {session} = useAuth()
    const userId = session?.user.id
    // const [expenseIDs, setExpenseIDs] = useState<String[]>([])
    const [expenseMembers, setExpenseMembers] = useState<ExpenseMember[]>()
    const amountsOwedToFriend: Record<string, number> = {}; //define the type of this object 
    const amountsOwedByFriend: Record<string, number> = {}
    const [expensesWithFriends, setExpensesWithFriends] = useState<FriendExpense[]>()
    
    const {loading: getExpenseMembersLoading, error: getExpenseMembersError, data: getExpenseMembers} = useQuery(GET_EXPENSE_MEMBERS_BY_EXPENSEID, {
        variables: {user_id:userId}, 
        fetchPolicy: 'no-cache',
    });

    // //got list of expenseMember data for each friend in the same expense that user is a part of
    useEffect(() => {
        if (getExpenseMembersLoading) return; // Exit early if data is loading
        if (getExpenseMembersError) {
          console.error("Error fetching expense members:", getExpenseMembersError);
          return; // Handle error gracefully (display error message, etc.)
        }
        const expenseMembers = getExpenseMembers?.expenseMembersByExpenseIds || []; // Destructure and handle potential undefined data     
        console.log("new expense members", expenseMembers) 
        setExpenseMembers(expenseMembers)
        if (expenseMembers.length > 0) {
            calculateSplitExpenses()
        }
      }, [getExpenseMembersLoading, getExpenseMembersError, expenseMembers]); // Only run when loading state or error changes

    //   //for each expense member row, add it to how much each friend owes/ is Owed
      const calculateSplitExpenses = () => {        
        expenseMembers?.forEach((expenseMember) => {
            // console.log("name of friend", expenseMember.member_id.username)
            const memberIdString = expenseMember.member_id.id;
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
        console.log("Amt owed by friend", amountsOwedByFriend)
        console.log("amt i owe", amountsOwedToFriend)
        calculateOverallAmtOwes()
      }

      const calculateOverallAmtOwes = () => {
        const overallAmtsOwed: Record<string, number> = {} //array of hashsets
        // Object.keys(amountsOwedToFriend).forEach((friend) => {
        //     const amountOwedToYou = amountsOwedByFriend[friend] || 0
        //     const amountYouOwe = amountsOwedToFriend[friend] || 0
        //     overallAmtsOwed[friend] = amountOwedToYou - amountYouOwe //overall amt that each person owes me (if neg means i owe them)
        // })
        for (const friend in amountsOwedByFriend) {
            const amountOwedToYou = amountsOwedByFriend[friend] || 0.0
            const amountYouOwe = amountsOwedToFriend[friend] || 0.0

            overallAmtsOwed[friend] = amountOwedToYou - amountYouOwe 
        }
        //make sure friends in both arrays are included 
        for (const friend in amountsOwedToFriend) {
            if (!overallAmtsOwed[friend]) {
                const amountOwedToYou = 0.0
                const amountYouOwe = amountsOwedToFriend[friend] || 0.0

                overallAmtsOwed[friend] = amountOwedToYou-amountYouOwe
            }
        }

        console.log("overall amt owed", overallAmtsOwed)
        // Object.entries converts it into an array of key-value pairs: [["6634", 11], ['332',4]]
        //.map(function([userId, amy])) => apply each key-value pair array to this mapping function that takes in 2 arguments and returns objects
        // transforms the array into: [{id: '..', amt: 3}, {id:'...', amt: 3}]
        const expensesWithFriends = Object.entries(overallAmtsOwed).map(([userId, amount]) => ({
            id: userId,
            amt: amount,
          }));
          
          setExpensesWithFriends(expensesWithFriends)
          console.log(expensesWithFriends)
      }


      //iterate over overallAmtsOwed and pass each to <friend> component
    return (
        <View className="flex-1 bg-purple-300">

            <FlatList data={expensesWithFriends} 
                renderItem={({ item }) => (
                    <FriendsListItem
                      amt={item.amt} // Destructure amt from item
                      id={item.id} // Destructure id from item
                      keyExtractor={item => item.id} // Key extractor remains the same
                    />
                  )}
                  onEndReachedThreshold={1}
                  contentInsetAdjustmentBehavior="automatic"
            />
            
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