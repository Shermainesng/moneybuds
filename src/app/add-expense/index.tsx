import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { Foundation } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { EvilIcons } from "@expo/vector-icons";
import { useGetFriendsList, useGetFriendsProfiles } from "@/src/api/friends";
import { useAuth } from "@/src/providers/AuthProvider";

export default function AddExpenseModal() {
  const {session} = useAuth()
  const id:string = session?.user.id
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [splitType, setSplitType] = useState("equal");
  const [splitAmount, setSplitAmount] = useState("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [friends, setFriends] = useState([])
  const [friendToSplitWith, setFriendToSplitWith] = useState("");

  //get all friend's avatar and names
  const {data: friendIDs, error: friendsError, isLoading: friendsIsLoading} = useGetFriendsList(id)
  const {data: friendsDetails } = useGetFriendsProfiles(friendIDs)

  if (friendsIsLoading) return <ActivityIndicator />;
  if (friendsError) return <Text>Failed to fetch friends</Text>;

  useEffect(() => {
    if(friendsDetails) {
      setFriends(friendsDetails)
    }
  }, [friendsDetails])
 
  function formatDate(date: Date) {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }

  function calculateSplitAmount() {
    if (splitType == "equal") {
      const amt = parseFloat(expenseAmount) / 2;
      setSplitAmount(amt.toString());
    }
  }

  function handleAddExpense() {
    if (!expenseName.trim() || !expenseAmount.trim()) {
      alert("Please fill in both fields");
      return;
    }

    const expense = {
      name: expenseName,
      amount: parseFloat(expenseAmount),
      date: selectedDate,
      friend: friendToSplitWith,
      split: splitType
    };

    setExpenseName("");
    setExpenseAmount("");
    setSelectedDate(new Date());
    setFriendToSplitWith("");
  }

  //when user clicks on text input, dropdown of all friends' names - user can select from list
  //as user types, choices become more refined
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="items-center gap-y-10 flex-1 bg-pink-200">
        <Stack.Screen
          options={{
            title: "new expense",
            headerStyle: {
              backgroundColor: "rgb(216 180 254)"
            },
            headerLeft: () => (
              <Link href="../">
                <EvilIcons name="close" size={24} color="black" />
              </Link>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={handleAddExpense} className="border border-black rounded-3xl p-1 bg-[#EDF76A]">
                <Ionicons name="checkmark" size={30} color="black" />
              </TouchableOpacity>
            )
          }}
        />

        <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', padding: 10, flexDirection: 'row', alignItems: 'center', height:40}}>
          <Text className="text-gray-500">split between you and: </Text>
          <TouchableOpacity onPress={() => setShowDropdown(true)} style={{ flex: 1 }}>
            {/* <TextInput placeholder="Enter friend's names" placeholderTextColor="gray" onChangeText={text => setFriendToSplitWith(text)} /> */}
            <Text>CLick me</Text>
          </TouchableOpacity>
            
            {showDropdown && (
              <View style={{ position: 'absolute', backgroundColor: 'white', top:40, left: 0, width: '50%', padding: 10}}>
                {friendsDetails && friendsDetails.length>0 && friendsDetails.map((friend) => (
                  <Text>{friend.username}</Text>
                ))}
              </View>
            )}
        </View>

        <View className="pt-10 w-[70vw] items-center">
          <View className="bg-[#EDF76A] w-full items-center rounded-t-xl border border-b-[0.5px] p-1">
            <Text className="text-lg font-medium">{formatDate(selectedDate)}</Text>
          </View>
          <View className="bg-[#FDF3FD] rounded-b-xl border border-t-[0.5px] p-3 pt-0 w-full">
            <TextInput className="border-b-[1px] text-lg text-black p-2" placeholder="expense description" placeholderTextColor="gray" value={expenseName} onChangeText={text => setExpenseName(text)} />
            <TextInput
              className="border-b-[1px] text-lg text-black p-2"
              placeholder="$0.00"
              placeholderTextColor="gray"
              value={expenseAmount}
              onChangeText={text => {
                setExpenseAmount(text);
              }}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Link href='./add-expense/split-details' asChild>
          <TouchableOpacity className="py-2 px-5 border bg-purple-300 shadow-lg">
            <Text>paid by you and split equally</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity className="items-center p-5 border border-dashed border-black bg-[#FDF3FD]" onPress={Keyboard.dismiss}>
          <Foundation name="camera" size={40} color="black" />
          <Text className="text-base">add receipt</Text>
          <Text className="text-gray-500 text-xs">(optional)</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}