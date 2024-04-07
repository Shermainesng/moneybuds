import { View, Text, TouchableOpacity, Keyboard, TextInput, ActivityIndicator } from "react-native";
import React, {useState, useEffect} from "react";
import { Stack, useRouter} from "expo-router";
import { Ionicons, Foundation } from "@expo/vector-icons";
import { useMutation } from "@apollo/client";
import { ADD_GROUP, ADD_GROUP_MEMBERS } from "@/src/api/groups";
import { useAuth } from "@/src/providers/AuthProvider";
import { Group } from "@/src/constants/type";

export default function AddGroupsScreen() {
  const {session} = useAuth()
  const userId = session?.user.id
  const router = useRouter();
  const [groupName, setGroupName] = useState<string>("")
  const[group, setGroup] = useState<Group>()
  const [addGroup, { loading, error: addGroupError }] = useMutation(ADD_GROUP, {
    update(cache, { data: { addGroup } }) {
      console.log("new group id:", addGroup.id);
      setGroup(addGroup);
      addGroupMember( {
        variables: {
          input: {
            userIds: [userId],
            group_id: addGroup.id,
          },
        },
      })
    },
  });

  const [addGroupMember, { error: addGroupMembersError }] = useMutation(ADD_GROUP_MEMBERS, {
    onCompleted: (data) => {
      console.log("added myself to group:", data);
    },
  });

  const handleCreateGroup = async () => {
    console.log('adding group!')
    try {
      await addGroup({
          variables: {
              input: {
                 name: groupName,
                 created_by: userId
              }
          }
      });
    } catch (error) {
        console.error("Error adding group:", error);
    }
    if (addGroupError) {
      console.error("GraphQL Error:", addGroupError);
    }
  }

    // navigate to that group/id tab once group is added
  useEffect(() => {
    if (group) {
        console.log("completed")
        router.replace(`/(tabs)/groups/${group.id}`)
    }
  }, [group]);

  return (
    <View className="flex-1 items-center pt-20">
      <Stack.Screen
        options={{
          title: "Create a group",
          headerStyle: { backgroundColor: "#EDF76A" },
          headerRight: () => (
            <TouchableOpacity onPress={handleCreateGroup}>
              <Text>Done</Text>
            </TouchableOpacity>
          )
        }}
      />
      {loading && <ActivityIndicator size="large" color="blue" />}
      <View className="flex-row items-center w-full px-2">
        <TouchableOpacity className="flex-col pt-2 items-center border border-dashed border-black bg-pink-50 w-20 h-20" onPress={Keyboard.dismiss}>
          <Foundation name="camera" size={30} color="black" />
          <Text className="text-xs w-20 text-center">add group photo</Text>
        </TouchableOpacity>
        <View className='flex-grow px-2'>
          <Text>Group Name:</Text>
          <TextInput className="text-lg border-b border-zinc-700 leading-6 pt-1 pb-2" placeholder="Enter group name" value={groupName} onChangeText={(text:string) => setGroupName(text)} />
        </View>
      </View>

    </View>
  );
}