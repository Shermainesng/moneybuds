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
    amount: string
    description: string
    participants: User[]
    groupId: number | null
}


export default function SplitTypes ({setShowSplitTypes, amount, participants, description, groupId}: SplitTypes) {
    const amtFloat = parseFloat(amount)
    const router = useRouter();
    const [payerIndex, setPayerIndex] = useState<number>(0)
    const [percentagesToSplitCost, setPercentagesToSplitCost] = useState<number[]>([])
    const [isOwed, setIsOwed] = useState<number[]>(Array(participants.length).fill(0));
    const [owes, setOwes] = useState<number[]>(Array(participants.length).fill(0));
    const [isOwedUpdated, setIsOwedUpdated] = useState<boolean>(false);
    const [owesUpdated, setOwesUpdated] = useState<boolean>(false);
    const [expenseId, setExpenseId] = useState<number>()
    const [expenseMembersAdded, setExpenseMembersAdded] = useState<boolean>(false)

    const [addExpense, {loading: expenseLoading, error: expenseError}] = useMutation(ADD_EXPENSE, {
        update(cache, {data: {addExpense}}) {
            console.log("newly added expense", addExpense)
            setExpenseId(parseInt(addExpense.id))
        }
    } )

    const [addExpenseMember, {loading: memberLoading, error: memberError}] = useMutation(ADD_EXPENSEMEMBER, {
        onCompleted: (data) => {
            console.log("Expense members added successfully:", data);
            setExpenseMembersAdded(true); // Update UI state or perform actions
          },
    });
    
    //FIVE
    //once expense is added and expenseID is set, call the mutation to add expense member 
    useEffect(() => {
        if (expenseId) {
            console.log("calling addExpenseMembers...");
            addExpenseMembers(); // Call the separate async function
        }
    }, [expenseId]);

    
      //SIX
      //add each person to expense members table
    async function addExpenseMembers() {
        if (expenseId) {
            // Construct an array of ExpenseMemberInput objects
            console.log('expenseId', expenseId)
            console.log('participants', participants)
            console.log('in add expense members isOwed', isOwed)
            console.log('in add expense members owes', owes)
            const expenseMemberInput = participants.map((participant, index) => ({
                expense_id: expenseId,
                member_id: participant.id,
                isOwed: isOwed[index],
                owes: owes[index],
            }));
            try {
                // Call addExpenseMember mutation with the constructed input
                await addExpenseMember({
                    variables: {
                        input: expenseMemberInput,
                    },
                });
            } catch (error) {
                console.error("Error adding expense members:", error);
            }
            if (memberError) {
                console.error("GraphQL error", memberError);
            }
        }
    }

    //set array of percentages when page first loads
    useEffect(() => {
        const equalPercent = parseFloat((100 / participants.length).toFixed(2));
        const initialPercentages = Array(participants.length).fill(equalPercent)
        setPercentagesToSplitCost(initialPercentages)
    }, [participants])

    //SEVEN
    // navigate to friends tab once expense and expense members are inserted in db 
    useEffect(() => {
        if (expenseMembersAdded) {
            if (groupId) {
                router.replace(`/(tabs)/groups/${groupId}`)
            } else {
                router.replace('/(tabs)/friends')
            }
        }
    }, [expenseMembersAdded]);

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

    //SECOND
    //calculate amount each person owes/isOwed
    const calculateAmountOwed = () => {
        percentagesToSplitCost.forEach((splitPercentage, index) => {
            const share = parseFloat(((splitPercentage / 100) * amtFloat).toFixed(2));//calc each participant's share

            if (index === payerIndex) {
                setIsOwed((prevIsOwed) => {
                   const updatedIsOwed = [...prevIsOwed]
                   updatedIsOwed[index] = amtFloat - share //amt that the rest owes her
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
    
    //FIRST 
    //make sure the percentages add up to 100. if yes, calculate each person's amt owed and is owned
    const validatePercentages = (tolerance = 0.02) => {
        console.log('percentage to split cost', percentagesToSplitCost)
        const totalPercentage = percentagesToSplitCost.reduce((sum, percentage) => sum + percentage, 0);
        console.log('total percentage', totalPercentage)
        const isWithinTolerance = Math.abs(totalPercentage - 100) <= tolerance;
        console.log(Math.abs(totalPercentage - 100))
        if (!isWithinTolerance) {
            Alert.alert('Total percentage must be 100.');
        } else {
            calculateAmountOwed()
        }
    }

    //THREE
    //once both isOwed and owes have been updated, add expense to expense table
    //if isGroup, add groupId to the group_id column
    useEffect(() => {
        // Check if both isOwed and owes have been updated
        if (isOwedUpdated && owesUpdated) {
            console.log("isOwed", isOwed)
            console.log("owes", owes)
            addingExpense(); // Call addingExpense only if both are updated
            setIsOwedUpdated(false); // Reset flags
            setOwesUpdated(false);
        }
    }, [isOwedUpdated, owesUpdated]); // Run effect whenever flags change

    //FOUR
    //Add expense in expense table. 
    const addingExpense = async () => {
        console.log("in adding expense")        
        try {
            await addExpense({
                variables: {
                    input: {
                        payer_id: participants[payerIndex].id,
                        amount: amtFloat,
                        description: description,
                        date: "2024-03-16", 
                        group_id: groupId !== null ? groupId:null
                    }
                }
            });
            //once added to Expense table, also add to Expense_members table - send in as array of expense members 
        } catch (error) {
            console.error("Error adding expense:", error);
        }
        if (expenseError) {
            console.error("GraphQL Error:", expenseError);
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
        {expenseLoading ||  memberLoading && <ActivityIndicator size="large" color="blue" />}
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
                                {/* make sure % assigned to each participant is the correct amt esp for calculating isOwed/owed */}
                                {/* TODO - percentageToSplitCost should reflect participants respectively */}
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