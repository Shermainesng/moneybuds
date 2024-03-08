import { View, Text, Pressable, FlatList, ActivityIndicator} from "react-native";
import {useState, useEffect} from 'react'
import { Link, Stack } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
// import { useFriendIDs } from "@/src/api/friends";
// import { useFetchFriendList } from "@/src/api/friends";
import { useGetFriendsList, useGetFriendsProfiles } from "@/src/api/friends";
import FriendsListItem from "@/src/components/FriendsListItem";
import { useAuth } from "@/src/providers/AuthProvider";

type Friend={ 

}
export default function FriendsScreen() {
    const {session} = useAuth()
    const id = session?.user.id
    
    // get list of friend IDs
    const {data: friendsIDs, error: IDsError, isLoading: IDsLoading} = useGetFriendsList(id)
    const {data: friends, error: friendsError, isLoading: friendsLoading} = useGetFriendsProfiles(friendsIDs)
    

    if (IDsError || friendsError) {
        return <Text>Failed to fetch data</Text>
        }

    if (IDsLoading || friendsLoading) {
        return <ActivityIndicator/>
    }
    
    return (
        <View className="flex-1 bg-purple-300">
            
            <FlatList data={friends} renderItem={({ item }) => <FriendsListItem item={item} />} onEndReachedThreshold={1} contentInsetAdjustmentBehavior="automatic" />

            <Link href="/add-expense/" asChild>
            <Pressable className="border border-black rounded-full bg-[#EDF76A] absolute bottom-[2px] p-2 right-[41vw] z-50">
            <Ionicons name="add" size={35} color="black" />
            </Pressable>
            </Link> 
            <View className="border border-black rounded-full bg-black absolute bottom-[0px] p-2 right-[40vw] z-40">
                <Ionicons name="add" size={35} color="black" />
            </View>
        </View>
    )
} 