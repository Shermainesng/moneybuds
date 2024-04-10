import { View, Text, Button, GestureResponderEvent, Alert, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { Link, Stack, router } from "expo-router";
import { EvilIcons, Foundation, Ionicons } from "@expo/vector-icons";
import { User } from "../constants/type";
import SplitTypes from "./SplitTypes";

interface ExpenseFormProps {
    participants: User[]
    selectedFriend: User
    setIsSelected: (value:boolean) => void
    groupId: number | null
}

export default function ExpenseForm({participants, selectedFriend, setIsSelected, groupId}: ExpenseFormProps) {
    const [description, setDescription] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [showSplitTypes, setShowSplitTypes] = useState<boolean>(false)
    console.log("participants in expense form", participants)

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        });
      }

    
    const validateExpenseForm = () => {
        if (description !== '' && amount > 0) {
            setShowSplitTypes(true)
        } else {
            Alert.alert('Oops! Enter a description and amount first')
        }
    }

    const handleAmountChange = (text:string) => {
        const parsedAmount = parseFloat(text)
        if (!isNaN(parsedAmount)) { //if is a number
            setAmount(parsedAmount)
        } else {
            Alert.alert('Enter a valid amount in numeric format')
        }
    }

    return (
        <View className="pt-5">
            <Stack.Screen
                options={{
                    
                      headerLeft: () => (
                        <Link href="../">
                          <EvilIcons name="close" size={24} color="black" />
                    </Link>
                      )
                }}/>

            {showSplitTypes ? (
                <SplitTypes setShowSplitTypes={setShowSplitTypes} amount={amount} participants={participants} description={description} groupId={groupId}/>
            ) : (
            <View>
                <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', padding:10, flexDirection: 'row', width:'100%'}}>
                    <Text className="text-gray-500">With you and:</Text>
                        <TouchableOpacity onPress={() => setIsSelected(false)}>
                            <Text>{selectedFriend.username}</Text>
                        </TouchableOpacity>
                </View>

                <View className="items-center flex-column">
                        <View className="pt-20 w-[70vw]">
                            <View className="bg-[#EDF76A] items-center w-full rounded-t-xl border border-b-[1px]">
                                <Text className="text-lg font-medium text-black">{formatDate(new Date())}</Text>
                            </View>
                            <View className="bg-[#FDF3FD] rounded-b-xl border border-t-[0.5px] p-3 pt-0 w-full">
                                <TextInput className="border-b-[1px] text-lg text-black p-2" placeholder="Enter a description" placeholderTextColor="gray"  value={description} onChangeText={text=> setDescription(text)}/>
                                <TextInput className="border-b-[1px] text-lg text-black p-2" placeholder="$0.00" placeholderTextColor="gray" value={amount !== undefined ? amount.toString() : ""} onChangeText={handleAmountChange} keyboardType="numeric" />
                            </View>
                        </View> 
                 </View>

                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={{
                        marginTop:30,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 8,
                        // borderWidth: 2,
                        borderColor: '#000',
                        backgroundColor: '#EDF76A',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        width:  '60%'
                    }}  onPress={validateExpenseForm}>
                        <Text>Paid by you and split equally</Text>
                    </TouchableOpacity>
                </View>
            </View>
            )}

        </View>
    )
}