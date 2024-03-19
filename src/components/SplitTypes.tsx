import React, {useState, useEffect} from 'react'
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, StyleSheet} from 'react-native';
import { RadioButton } from 'react-native-paper'; 
import { Stack, useRouter } from 'expo-router';
import { User, Expense, ExpenseMember} from '../constants/type';
import { EvilIcons, Foundation, Ionicons } from "@expo/vector-icons";
import { useMutation } from '@apollo/client';
import { ADD_EXPENSE, ADD_EXPENSEMEMBER } from '../api/expenses';
import { useAuth } from '../providers/AuthProvider';

type SplitTypes = { 
    setShowSplitTypes: (value:boolean) => void
    amount: number
    description: string
    participants: User[]
}


export default function SplitTypes ({setShowSplitTypes, amount, participants, description}: SplitTypes) {
    const {session} = useAuth()
    const userId: string = session?.user.id !== undefined ? session.user.id.toString() : '';
    // const [payer, setPayer] = useState<User>(participants[0])
    const [payerIndex, setPayerIndex] = useState<number>(0)
    const [percentagesToSplitCost, setPercentagesToSplitCost] = useState<number[]>([])
    const [isOwed, setIsOwed] = useState<number[]>(Array(participants.length).fill(0));
    const [owes, setOwes] = useState<number[]>(Array(participants.length).fill(0));
    const [isOwedUpdated, setIsOwedUpdated] = useState<boolean>(false);
    const [owesUpdated, setOwesUpdated] = useState<boolean>(false);
    const [expenseId, setExpenseId] = useState<number>()
//    const [addExpense, { data, loading, error }] = useApolloMutation(ADD_EXPENSE)
    const [addExpense, {loading, error}] = useMutation(ADD_EXPENSE, {
        update(cache, {data: {addExpense}}) {
            console.log("newly added expense", addExpense)
            setExpenseId(parseInt(addExpense.id))
        }
    } )

    const [addExpenseMember] = useMutation(ADD_EXPENSEMEMBER)

    useEffect(() => {
        if (expenseId) {
            // Construct an array of ExpenseMemberInput objects
            const expenseMemberInput = participants.map((participant) => ({
                expense_id: expenseId,
                member_id: participant.id,
                isOwed: participant.isOwed,
                owes: participant.owes
            }));

            // Call addExpenseMember mutation with the constructed input
            addExpenseMember({
                variables: {
                    input: expenseMemberInput
                }
            });
        }
    }, [expenseId]);

   const router = useRouter();

    //set array of percentages when page first loads
    useEffect(() => {
        const initialPercentages = Array(participants.length).fill(50)
        setPercentagesToSplitCost(initialPercentages)
    }, [participants])

    // navigate to friends tab once expense submitted 
    // useEffect(() => {
    //     if (data) {
    //         console.log("expenseId", expenseId)
    //         // router.replace('/(tabs)/friends')
    //     }
    // }, [data]);

    //take in string and parse it to number to store in percentage array
    const handlePercentageChange = (text:string, index:number) => {
        const newPercentages = [...percentagesToSplitCost];
        if (text === '') {
            newPercentages[index] = 0; // Set a default value when input is empty
        } else {
            newPercentages[index] = parseFloat(text);
        }
        setPercentagesToSplitCost(newPercentages)
    }

    //calculate amount each person owes/isOwed
    const calculateAmountOwed = () => {
        //go through each percentage and index, if index is payer index,
        //calculate isOwed through percentage and add to array 
        percentagesToSplitCost.forEach((splitPercentage, index) => {
            const share = parseFloat(((splitPercentage / 100) * amount).toFixed(2));//calc each participant's share

            if (index === payerIndex) {
                setIsOwed((prevIsOwed) => {
                   const updatedIsOwed = [...prevIsOwed]
                   updatedIsOwed[index] = share
                   return updatedIsOwed
                })
                setIsOwedUpdated(true);
            }else {
                setOwes(prevOwes => {
                    const updatedOwes = [...prevOwes]
                    updatedOwes[index] = share
                    return updatedOwes
                })
                setOwesUpdated(true);
            }
        })
    }

    //make sure the percentages add up to 100. if yes, add expense
    //once expense is added in expense table, add in expense_member table for each member 
    const validatePercentages = () => {
        const totalPercentage = percentagesToSplitCost.reduce((sum, percentage) => sum + percentage, 0);
        if (totalPercentage !== 100) {
            Alert.alert('Total percentage must be 100.');
        } else {
            calculateAmountOwed()
            addingExpense()
        }
    }

    useEffect(() => {
        // Check if both isOwed and owes have been updated
        if (isOwedUpdated && owesUpdated) {
            console.log(isOwed)
            addingExpense(); // Call addingExpense only if both are updated
            setIsOwedUpdated(false); // Reset flags
            setOwesUpdated(false);
        }
    }, [isOwedUpdated, owesUpdated]); // Run effect whenever flags change

    const addingExpense = async () => {
        console.log("in adding expense")        
        try {
            await addExpense({
                variables: {
                    input: {
                        payer_id: participants[payerIndex].id,
                        amount: amount,
                        description: description,
                        date: "2024-03-16"
                    }
                }
            });
            //once added to Expense table, also add to Expense_members table - send in as array of expense members 
        } catch (error) {
            console.error("Error adding expense:", error);
        }
        if (loading) {
            return <ActivityIndicator/>
        }
        if (error) {
            console.error("GraphQL Error:", error);
        }
    };
    

 
  return (
    <View>
        <Stack.Screen
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={() => validatePercentages()} className="border border-black rounded-3xl p-1 bg-[#EDF76A]">
                          <Ionicons name="checkmark" size={30} color="black" />
                        </TouchableOpacity>
                      ), 
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => setShowSplitTypes(false)} className="border border-black rounded-3xl p-1 bg-[#EDF76A]">
                          <Text>Cancel</Text>
                        </TouchableOpacity>
                      )
                }}/>
        <View className='flex-col items-center'>
            <View className='flex-col items-center border-b-2 border-black py-3 w-full'>
                <Text>How was this expense split?</Text>
                <Text>Enter the percentage split for your expense</Text>
            </View>
            
            
            <View className='flex-col w-full border border-blue-50 px-3'>
                <Text style={styles.largeText}>Paid by: </Text>
                {participants && participants.length>0 && participants.map((participant, index) => (
                    <View key={index} className='flex-row items-center justify-between'>
                        <Text>{participant.username}</Text>
                        <View>
                            <RadioButton.Android
                                value={participant.id}
                                status={payerIndex === index ? 'checked': 'unchecked'}
                                onPress={() => setPayerIndex(index)}
                                color="#007BFF"
                            />
                        </View>
                    </View>
                ))}
                <Text style={styles.largeText}>Split by:</Text>
                {participants && participants.length>0 && participants.map((participant, index) => (
                    <View key={index} className='flex-row items-center justify-between'>
                        <Text>{participant.username}</Text>
                        {percentagesToSplitCost && percentagesToSplitCost.length > 0 && (
                            <View className='flex-row items-center'>
                                <TextInput className="border-b-[1px] text-lg text-black pb-2" value={percentagesToSplitCost[index].toString()} onChangeText={(text) => handlePercentageChange(text, index)} placeholderTextColor="gray" keyboardType="numeric"/>
                                <Text>%</Text>
                            </View>
                         )
                        }
                    </View>
                ))}
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    largeText : {
        fontSize: 25, 

    }
})