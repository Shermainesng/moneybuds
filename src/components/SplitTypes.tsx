import React, {useState, useEffect} from 'react'
import { View, Text, TouchableOpacity, TextInput} from 'react-native';
import { Stack } from 'expo-router';
import { User } from '../constants/type';

type SplitTypes = { 
    splitMethod: string
    setShowSplitTypes: (value:boolean) => void
    // setSplitMethod: (value: string) => void
    amount: string
    participants: User[]
}


export default function SplitTypes ({setShowSplitTypes, amount, participants}: SplitTypes) {
    const [percentages, setPercentages] = useState<number[]>([])

    //set percentages to 50-50 when first loads 
    useEffect(() => {
        const initialPercentages = Array(participants.length).fill(50)
        setPercentages(initialPercentages)
    }, [participants])

    const handlePercentageChange = (text:string, index:number) => {
        const newPercentages = [...percentages];
        newPercentages[index] = parseFloat(text);
        setPercentages(newPercentages)
    }

  return (
    <View>
        <Stack.Screen
                options={{
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
            
            <View className='flex-col'>
                {participants.map((participant, index) => (
                    <View key={index} className='flex-row items-center align-middle'>
                        <Text>{participant.username}</Text>
                        <TextInput className="border-b-[1px] text-lg text-black p-2" value={percentages[index].toString()} onChangeText={(text) => handlePercentageChange(text, index)} placeholderTextColor="gray" keyboardType="numeric"/><Text>%</Text>
                    </View>
                ))}
            </View>
        </View>
    </View>
  );
}
