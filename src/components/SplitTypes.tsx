import React, {useState, useEffect} from 'react'
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, StyleSheet} from 'react-native';
import { RadioButton } from 'react-native-paper'; 
import { Stack, useRouter } from 'expo-router';
import { User, Expense, ExpenseMember} from '../constants/type';
import { EvilIcons, Foundation, Ionicons } from "@expo/vector-icons";
import { useQuery, gql, useMutation } from '@apollo/client';
import { ADD_EXPENSE } from '../api/expenses';
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
    const [percentages, setPercentages] = useState<number[]>([])
    // const [newExpense, setNewExpense] = useState<Expense>()
    const [expenseId, setExpenseId] = useState<number>()
    const [expenseInput, setNewExpenseInput] = useState<ExpenseMember>()
   const [addExpense, { data, loading, error }] = useMutation(ADD_EXPENSE)

   const router = useRouter();

    //array of percentages when page first loads
    useEffect(() => {
        const initialPercentages = Array(participants.length).fill(50)
        setPercentages(initialPercentages)
        // console.log(percentages)
    }, [])

    // navigate to friends tab once expense submitted 
    // useEffect(() => {
    //     if (data) {
    //         console.log("expenseId", expenseId)
    //         // router.replace('/(tabs)/friends')
    //     }
    // }, [data]);

    //take in string and parse it to number to store in percentage array
    const handlePercentageChange = (text:string, index:number) => {
        const newPercentages = [...percentages];
        if (text === '') {
            newPercentages[index] = 0; // Set a default value when input is empty
        } else {
            newPercentages[index] = parseFloat(text);
        }
        setPercentages(newPercentages)
    }

    //calculate amount each person owes/isOwed
    const calculateAmountOwed = () => {
        const payerPercentage = percentages[payerIndex];
        const payerAmount = (payerPercentage / 100) * amount; //5
        const remainingAmount = amount - payerAmount; //5

        const owes = participants.map((participant, index) => {
            if (index === payerIndex) {
                return 0; // Payer owes nothing to themselves
            }
            const participantPercentage = percentages[index];
            const participantAmount = (participantPercentage / 100) * remainingAmount;
            return participantAmount;
        });
    }
    //make sure the percentages add up to 100. if yes, add expense
    //once expense is added in expense table, add in expense_member table for each member 
    const validatePercentages = () => {
        console.log("submit button clicked")
        const totalPercentage = percentages.reduce((sum, percentage) => sum + percentage, 0);
        if (totalPercentage !== 100) {
            Alert.alert('Total percentage must be 100.');
        } else {
            addingExpense()
        }
    }

    const addingExpense = async () => {
        console.log("in adding expense")
        // console.log(participants[payerIndex].id, amount, description)
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
            if (data && data.addExpense) {
                console.log(data.addExpense)
                setExpenseId(parseInt(data.addExpense.id))
            }
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
                        {percentages && percentages.length > 0 && (
                            <View className='flex-row items-center'>
                                <TextInput className="border-b-[1px] text-lg text-black pb-2" value={percentages[index].toString()} onChangeText={(text) => handlePercentageChange(text, index)} placeholderTextColor="gray" keyboardType="numeric"/>
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