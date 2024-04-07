import React, {useState, useEffect} from 'react';
import { GET_FRIENDS } from '@/src/api/friends';
import { ADD_GROUP_MEMBERS } from '@/src/api/groups';
import { useQuery, useMutation} from '@apollo/client';
import { useAuth } from '@/src/providers/AuthProvider';
import { User } from '@/src/constants/type';
import { View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {CheckBox} from 'react-native-btr'
import { Stack, useLocalSearchParams, useRouter} from 'expo-router';

export interface IFriendsListProps {
}

export default function FriendsList () {
    const {session} = useAuth()
    const userId:string | undefined = session?.user.id
    const {groupId} = useLocalSearchParams()
    const router = useRouter();
    const [friends, setFriends] = useState<User[]>([])
    const [selectedFriendIds, setSelectedFriendIds] = useState<String[]>([])
    const [friendsAdded, setFriendsAdded] = useState<Boolean>(false)

    const {loading: getFriendsLoading, error: getFriendsError, data: getFriends} = useQuery(GET_FRIENDS, {
        variables: {id:userId}, 
        fetchPolicy: 'network-only',
        onCompleted: ({friends}) => {
            console.log("got friends:", friends);
            setFriends(friends);
        },
    });
//TODO: for all friends that i got, check if friend alr belongs to group. if they do, don't display them

    const [addGroupMember, { error: addGroupMembersError, loading:addGroupMembersLoading }] = useMutation(ADD_GROUP_MEMBERS, {
        onCompleted: (data) => {
          console.log("added friends to group", data);
        },
      });

    const handleCheckFriend = (friendId:string) => {
        console.log("reached handlefriend")
        const newSelectedFriends = [...selectedFriendIds]
        const friendIndex = newSelectedFriends.findIndex((friend) => friend == friendId)

        if (friendIndex !== -1) {
            //friend alr checked, now uncheck
            newSelectedFriends.splice(friendIndex, 1)
        } else {
            //friend not checked, now check
            newSelectedFriends.push(friendId)
        }
        setSelectedFriendIds(newSelectedFriends)
        console.log(selectedFriendIds)
    }

    const addFriends = async() => {
        console.log('adding friends', selectedFriendIds)
        try {
            await addGroupMember({
                variables: {
                    input: {
                       userIds: selectedFriendIds, 
                       group_id: groupId
                    }
                }
            });
            setFriendsAdded(true)
          } catch (error) {
              console.error("Error adding group:", error);
          }
          if (addGroupMembersError) {
            console.error("GraphQL Error:", addGroupMembersError);
          }
    }


    useEffect(()=> {
        if (friendsAdded) {
            router.replace(`/(tabs)/groups/${groupId}`)
        }
    }, [friendsAdded])

  return (
    <View>
        <Stack.Screen options={{title:'Add friends',
                headerStyle: {
                    backgroundColor: "#EDF76A"
                }, 
                headerRight:() => (
                    <TouchableOpacity onPress={addFriends} className="border border-black rounded-3xl p-1 bg-[#EDF76A]">
                        <Text>Add Friends!</Text>
                  </TouchableOpacity>
                )
            }}
             />
             {addGroupMembersLoading && <ActivityIndicator size='large' color='purple'/>}
            {friends && friends.length>0 && friends.map((friend, index)=> (
                <View key={friend.id} className='flex flex-row'>
                    <CheckBox 
                        checked={selectedFriendIds.includes(friend.id)}
                        color='#C7A1F2'
                        onPress={()=>handleCheckFriend(friend.id)}
                    />
                    <Text>{friend.username}</Text>
                </View>
            ))}
    </View>
  );
}
