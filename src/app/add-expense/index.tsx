import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { Foundation } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams} from "expo-router";
import { EvilIcons } from "@expo/vector-icons";
import { useAuth } from "@/src/providers/AuthProvider";
import { User } from "@/src/constants/type";
import ExpenseForm from "@/src/components/ExpenseForm";
import { GET_FRIENDS, GET_USER   } from "@/src/api/friends";
import { GET_GROUP_MEMBERS } from "@/src/api/groups";
import { useQuery } from "@apollo/client";

export default function AddExpenseModal() {
  const {session} = useAuth()
  const userId:string | undefined= session?.user.id
const [filteredData, setFilteredData] = useState<User[]>([]);
  const[searchTerm, setSearchTerm] = useState('')
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null)
  const [isSelected, setIsSelected] = useState<boolean>(false)
  const [friends, setFriends] = useState<User[]>([]) //array for list of all friends to choose from 
  const [participants, setParticipants] = useState<User[]>([]) //array of user objects (id, name ,avatar) for people involved 
  const [isGroup, setIsGroup] = useState<boolean>(false)
  const [groupMembers, setGroupMembers]= useState<User[]>([])
  const {IDfromParams} = useLocalSearchParams()
  // console.log("group id from params", typeof IDfromParams)
  const groupId = IDfromParams !== undefined ? parseInt(typeof IDfromParams == 'string' ? IDfromParams:IDfromParams[0]):null


  //check if is group or not
useEffect(()=> {
  if (groupId) {
    console.log('groupId in add expense', groupId)
    setIsGroup(true)
  }
}, [isGroup, groupId])

  //fetching friends list for NON GROUP
    const {loading: getUserLoading, error: getUserError, data: getUser} = useQuery(GET_USER, {
      variables: {id:userId}
  });
    const {loading: getFriendsLoading, error: getFriendsError, data: getFriends} = useQuery(GET_FRIENDS, {
        variables: {id:userId}, 
        fetchPolicy: 'network-only',
    });

  //fetching group members for GROUP
  const {loading:getGroupMembersLoading, error: getGroupMembersError, data: currentGroupMembers} = useQuery(GET_GROUP_MEMBERS, {
    variables: {groupId: groupId},
    fetchPolicy: 'network-only',
    onCompleted: ({groupMembers}) => {
      const membersExcludeMe = groupMembers.filter((member: User) => member.id !== userId);
      console.log("without me", membersExcludeMe)
      setGroupMembers(membersExcludeMe); // Set the filtered data directly
    }
})


  //
  // //add user into the participants list 
  useEffect(() => {
    if (getUserLoading || getUserError || getFriendsLoading || getFriendsError) {
      return; // Exit early if data is loading or there's an error
    }
    // add myself into participants list 
    setParticipants(getUser?.profile ? [getUser.profile] : []);
  
    // Update friends
    console.log("friends", getFriends.friends)
    setFriends(getFriends.friends);
  }, [getUserLoading, getUserError, getFriendsLoading, getFriendsError]);
  

  const handleInputChange = (text:string) => {
    setSearchTerm(text)
    let filtered = isGroup ? groupMembers : friends; 
    filtered = filtered.filter(item => item.username.toLowerCase().includes(text.toLowerCase()));
    setFilteredData(filtered); // Set the filtered array directly
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
          }}
        />
        {/* if no friend selected yet show list of friends  */}
        {!isSelected &&
          <View>
              <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', padding:10, flexDirection: 'row', width:'100%'}}>
                <Text className="text-gray-500">With you and:</Text>
                <TextInput placeholder="Enter friend's names" value={searchTerm} placeholderTextColor="gray" onChangeText={handleInputChange} />
              </View>

                {isGroup ? 
                <View style={{paddingLeft:10}}>
                <Text style={{fontWeight:'bold'}}>Group Members:</Text>
                {groupMembers && groupMembers.length > 0 && //group members without me
                  <FlatList
                      data={searchTerm === "" ? groupMembers : filteredData}
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
                }
              </View>
                :
                <View style={{paddingLeft:10}}>
                  <Text style={{fontWeight:'bold'}}>Friends:</Text>
                  {friends && friends.length > 0 &&
                    <FlatList
                        data={searchTerm === "" ? friends : filteredData}
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
                  }
                </View>
                }
            </View>
          }
          {/* once a friend is selected, render the expense form component  */}
          {isSelected && selectedFriend &&
            <ExpenseForm participants={participants} selectedFriend={selectedFriend} setIsSelected={setIsSelected} groupId={groupId}/>} 
        </View>
    </TouchableWithoutFeedback>
  );
}