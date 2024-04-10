import { View, Text, Pressable, FlatList, ActivityIndicator} from "react-native";
import {useState, useEffect} from 'react'
import { Link, Stack } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
// import { useFriendIDs } from "@/src/api/friends";
// import { useFetchFriendList } from "@/src/api/friends";
import FriendsListItem from "@/src/components/FriendsListItem";
import { useAuth } from "@/src/providers/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_EXPENSE_MEMBERS_BY_EXPENSEID, GET_EXPENSE_MEMBERS_BY_GROUPID } from "@/src/api/expenses";
import { ExpenseMember, User, FriendExpense } from "@/src/constants/type";
import { client } from "../../_layout";

type friendsProps = {
    groupId: number | null
    isGroup: boolean 
}
export default function FriendsScreen({groupId, isGroup = false}:friendsProps) {
    const {session} = useAuth()
    const userId = session?.user.id
    // const [expenseIDs, setExpenseIDs] = useState<String[]>([])
    const [expenseMembers, setExpenseMembers] = useState<ExpenseMember[]>()
    const [expensesGroups, setExpensesGroups] = useState<ExpenseMember[]>()
    const amountsOwedToFriend: Record<string, number> = {}; //define the type of this object 
    const amountsOwedByFriend: Record<string, number> = {}
    const [expensesWithFriends, setExpensesWithFriends] = useState<FriendExpense[]>()
    const [isCompleteFriends, setIsCompleteFriends ] = useState<boolean>(false)

    
    console.log("index", groupId)
    //for overall amount owed/is owed non-group + group 
    const {loading: getExpenseMembersLoading, error: getExpenseMembersError, data: getExpenseMembers} = useQuery(GET_EXPENSE_MEMBERS_BY_EXPENSEID, {
        variables: {userId:userId}, 
        fetchPolicy: 'no-cache',
        onCompleted: ({expenseMembersByExpenseIds}) => {
            if (!isGroup) {
                console.log("friends transaction in friends/index", expenseMembersByExpenseIds) 
                setExpenseMembers(expenseMembersByExpenseIds)
                setIsCompleteFriends(true)
            }
        }
    });
    //for amount owed/is owed within individual groups
    const {loading: getGroupExpensesLoading, error: getGroupExpensesError, data: getGroupExpenses} = useQuery(GET_EXPENSE_MEMBERS_BY_GROUPID, {
        variables: {groupId:groupId, userId:userId}, 
        fetchPolicy: 'no-cache',
        onCompleted: ({expenseMembersByGroupIds}) => {
            if(groupId) {
                console.log("groups transaction in friends/index", expenseMembersByGroupIds)
                setExpenseMembers(expenseMembersByGroupIds)
                setIsCompleteFriends(true)
            }
        }
    });

    useEffect(()=> {
        if (isCompleteFriends) {
            console.log("isGroup mode:", isGroup)
            calculateSplitExpenses()
        }

    }, [isCompleteFriends])

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
                      amt={item.amt} 
                      id={item.id} 
                      key={item.id} // Key extractor remains the same
                    />
                  )}
                  onEndReachedThreshold={1}
                  contentInsetAdjustmentBehavior="automatic"
            />
            
            {!groupId &&
            <View>
                <Link href="/add-expense/" asChild>
                <Pressable className="border border-black rounded-full bg-[#EDF76A] absolute bottom-[2px] p-2 right-[41vw] z-50">
                <Ionicons name="add" size={35} color="black" />
                </Pressable>
                </Link> 
                <View className="border border-black rounded-full bg-black absolute bottom-[0px] p-2 right-[40vw] z-40">
                    <Ionicons name="add" size={35} color="black" />
                </View>
            </View>
            }
        </View>
    )
}