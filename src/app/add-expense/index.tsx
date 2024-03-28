import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { Foundation } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { EvilIcons } from "@expo/vector-icons";
import { useGetFriendsList, useGetFriendsProfiles, useGetUserProfile } from "@/src/api/friends";
import { useAuth } from "@/src/providers/AuthProvider";
import { User } from "@/src/constants/type";
import ExpenseForm from "@/src/components/ExpenseForm";

export default function AddExpenseModal() {
  const {session} = useAuth()
  const id:string = session?.user.id
  const [filteredData, setFilteredData] = useState([])
  const[searchTerm, setSearchTerm] = useState('')
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null)
  const [isSelected, setIsSelected] = useState<boolean>(false)
  const [participants, setParticipants] = useState<User[]>([]) //array of user objects (id, name ,avatar) for people involved 

  //get all friend's avatar and names
  const {data: friendIDs, error: friendsError, isLoading: friendsIsLoading} = useGetFriendsList(id)
  const {data: friendsDetails } = useGetFriendsProfiles(friendIDs)
  const {data: userDetails} = useGetUserProfile(id)

  if (friendsIsLoading) return <ActivityIndicator />;
  if (friendsError) return <Text>Failed to fetch friends</Text>;

  // add user in participants
  useEffect(() => {
    // console.log("in useeffect", userDetails)
    if (participants.length === 0) {
      if(userDetails !== undefined) {
        participants.push(userDetails)
      }
    }
  }, [participants, userDetails])


  const handleInputChange = (text:string) => {
    setSearchTerm(text)
    const filtered = friendsDetails.filter(item => item.username.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  }


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-pink-200 gap-y-2">
        <Stack.Screen
          options={{
            title: "Add an expense",
            headerStyle: {
              backgroundColor: "rgb(216 180 254)"
            },
            headerLeft: () => (
              <Link href="../">
                <EvilIcons name="close" size={24} color="black" />
              </Link>
            ),
            // headerRight: () => (
            //   <TouchableOpacity onPress={handleAddExpense} className="border border-black rounded-3xl p-1 bg-[#EDF76A]">
            //     <Ionicons name="checkmark" size={30} color="black" />
            //   </TouchableOpacity>
            // )
          }}
        />
        {/* if no friend selected, yet show list of friends  */}
        {!isSelected &&
          <View>
              <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', padding:10, flexDirection: 'row', width:'100%'}}>
                <Text className="text-gray-500">With you and:</Text>
                <TextInput placeholder="Enter friend's names" value={searchTerm} placeholderTextColor="gray" onChangeText={handleInputChange} />
              </View>

              <View style={{paddingLeft:10}}>
                <Text style={{fontWeight:'bold'}}>Friends:</Text>
                <FlatList
                    data={searchTerm === "" ? friendsDetails : filteredData}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => {
                        setSelectedFriend(item)
                        setIsSelected(true)
                        setParticipants([...participants, item])
                      }} 
                        style={{ borderWidth: 1, borderColor: "#E0DFDB", paddingVertical: 15, marginBottom:10 }}>
                        <Text>{item.username}</Text>
                      </TouchableOpacity>
                    )}
                  />
              </View>
            </View>
          }
          {/* once a friend is selected, render the expense form component  */}
          {isSelected && 
            <ExpenseForm participants={participants} selectedFriend={selectedFriend} setIsSelected={setIsSelected}/>}
        </View>
    </TouchableWithoutFeedback>
  );
}