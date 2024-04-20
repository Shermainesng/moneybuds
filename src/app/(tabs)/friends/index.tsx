import { View, Text, Pressable, FlatList, ActivityIndicator} from "react-native";
import {useState, useEffect} from 'react'
import { Link, Stack } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
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
type MemberId = string
type Amount = number

type indivOwedAmts = {
    [memberId: MemberId]: Amount //memberId as key, amount as value
}
type indivOwedBoolean = {
    [memberId: MemberId]: boolean //memberId as key, amount as value
}
type OverallOwedAmts = {
    [memberId: MemberId] : indivOwedAmts //an object of objects
}
type netOverallOwedBoolean = {
    [member: MemberId] : indivOwedBoolean
}
export default function FriendsScreen({groupId, isGroup = false}:friendsProps) {
    const {session} = useAuth()
    const userId = session?.user.id
    const [expenseMembers, setExpenseMembers] = useState<ExpenseMember[]>()
    const [expensesGroups, setExpensesGroups] = useState<ExpenseMember[]>()
    const amountsOwedToFriend: Record<string, string> = {};
    const amountsOwedByFriend: Record<string, string> = {};
    const [expensesWithFriends, setExpensesWithFriends] = useState<OverallOwedAmts>({})
    const [isCompleteFriends, setIsCompleteFriends ] = useState<boolean>(false)

    //for overall amount owed/is owed non-group + group 
    const {loading: getExpenseMembersLoading, error: getExpenseMembersError, data: getExpenseMembers} = useQuery(GET_EXPENSE_MEMBERS_BY_EXPENSEID, {
        variables: {userId:userId, expenseId: null}, 
        fetchPolicy: 'no-cache',
        onCompleted: ({expenseMembersByExpenseIds}) => {
            if (!isGroup) {
                console.log(expenseMembersByExpenseIds)
                setExpenseMembers(expenseMembersByExpenseIds)
                setIsCompleteFriends(true)
            } 
            if (getExpenseMembersError) {
                console.log("error fetching GET_EXPENSE_MEMBERS_BY_EXPENSEID",getExpenseMembersError )
            }
        }
    });
    //for amount owed/is owed within individual groups
    const {loading: getGroupExpensesLoading, error: getGroupExpensesError, data: getGroupExpenses} = useQuery(GET_EXPENSE_MEMBERS_BY_GROUPID, {
        variables: {groupId:groupId, userId:userId}, 
        fetchPolicy: 'no-cache',
        onCompleted: ({expenseMembersByGroupIds}) => {
            if(groupId) {
                // console.log("groups transaction in friends/index", expenseMembersByGroupIds)
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

    //for each expense member row, add it to how much each friend owes/ is Owed
      const calculateSplitExpenses = () => {  
        const amountOwedByEachPerson: OverallOwedAmts = {}      
        expenseMembers?.forEach((expenseMember) => {
            const memberIdString = expenseMember.member_id.id;
            const payerIdString = expenseMember.expense_id.payer_id.id
            if (memberIdString !== payerIdString) {
                amountOwedByEachPerson[memberIdString] = (amountOwedByEachPerson[memberIdString] || {}) //sub-object
                amountOwedByEachPerson[memberIdString][payerIdString] = (amountOwedByEachPerson[memberIdString][payerIdString] || 0) + expenseMember.owes //member owes payer 'owes' amt
            }
        })
        // console.log("amt owed by each person", amountOwedByEachPerson)
        calculateNetOwed(amountOwedByEachPerson)
      }

      //doing to calculations to find net that each person owes/isOwed
      const calculateNetOwed = (amountOwedByEachPerson: OverallOwedAmts) => {
       let netAmtOwedByEachPerson:OverallOwedAmts = {}

       for (const [person, debts] of Object.entries(amountOwedByEachPerson)) {
        // console.log([person, debts])
        
        for (const [debtor, amount] of Object.entries(debts)) {
            if (debtor !== person) {
                netAmtOwedByEachPerson[person] = netAmtOwedByEachPerson[person] || {};
                netAmtOwedByEachPerson[debtor] = netAmtOwedByEachPerson[debtor] || {};
                netAmtOwedByEachPerson[person][debtor] = (netAmtOwedByEachPerson[person][debtor] || 0) + amount;
                netAmtOwedByEachPerson[debtor][person] = (netAmtOwedByEachPerson[debtor][person] || 0) - amount;
          }
        }
      }
    //    console.log("amt", netAmtOwedByEachPerson)

       //collapsing into a simpler object
        if (userId) {
            delete netAmtOwedByEachPerson[userId];
        }
        //if in friends tab - remove any record that I'm not involved in 
        if (!groupId) {
            for (const [person, debts] of Object.entries(netAmtOwedByEachPerson)) {
                for (const [debtor, amount] of Object.entries(debts)) {
                    if (person !== userId && debtor !== userId) {
                        delete netAmtOwedByEachPerson[person][debtor];
                    }
                }
                // If the person no longer has any debts after removing transactions, delete the person
                if (Object.keys(netAmtOwedByEachPerson[person]).length === 0) {
                    delete netAmtOwedByEachPerson[person];
                }
            }
        }
       
        console.log("final output", netAmtOwedByEachPerson)

       setExpensesWithFriends(netAmtOwedByEachPerson)
      }


      //iterate over overallAmtsOwed and pass each to <friend> component
    return (
        <View className="flex-1 bg-purple-300">
                    <FlatList
                    data={Object.entries(expensesWithFriends)}
                    renderItem={({ item }) => {
                        const [person, debts] = item;
                        return (
                        <FriendsListItem
                            key={person}
                            person={person}
                            debts={debts}
                        />
                        );
                    }}
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

// [
//     ['Sam', { Dini: -0.50 }],
//     ['Lilian', { Dini: 1 }]
// ]