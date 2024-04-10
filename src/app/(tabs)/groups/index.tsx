import { View, Text, ImageBackground, StyleSheet, FlatList, Pressable, TouchableOpacity, ScrollView } from "react-native";
import { Link, Stack } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@apollo/client";
import { GET_GROUPS } from "@/src/api/groups";
import { useAuth } from "@/src/providers/AuthProvider";
import { useState } from "react";
import { Group } from "@/src/constants/type";
import GroupsListItem from "@/src/components/GroupsListItem";

export default function IndexScreen() {
  const {session} = useAuth()
  const userId:string | undefined = session?.user.id
  const [groups, setGroups] = useState<Group[]>([])
  const { loading: getGroupsLoading, error: getGroupsError, data } = useQuery(GET_GROUPS, {
    variables: { userId: userId}, 
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log("group data", data)
      setGroups(data.groups)
    }
  });

  return (
    <View className="flex-1 bg-purple-300">
      
      <FlatList data={groups} 
                renderItem={({ item }) => (
                    <GroupsListItem
                      name={item.name} 
                      id={item.id} 
                      key={item.id} // Key extractor remains the same
                    />
                  )}
                  onEndReachedThreshold={1}
                  contentInsetAdjustmentBehavior="automatic"
            />

      {/* <Link href={'/add-expense/'} asChild>
        <Pressable className="border border-black rounded-full bg-[#EDF76A] absolute bottom-[2px] p-2 right-[41vw] z-50">
          <Ionicons name="add" size={35} color="black" />
        </Pressable>
      </Link>
      <View className="border border-black rounded-full bg-black absolute bottom-[0px] p-2 right-[40vw] z-40">
        <Ionicons name="add" size={35} color="black" />
      </View> */}
    </View>
  );
}