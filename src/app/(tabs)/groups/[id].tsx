import { View, Text, TouchableOpacity, Pressable, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { Stack, useLocalSearchParams} from "expo-router"
import {useState} from 'react'
import { Link } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import FriendsScreen from "../friends"

const GroupDetailsScreen = () => {
    const {id} = useLocalSearchParams()
    const [showFriendsList, setShowFriendsList] = useState<boolean>(false)
    const groupId = id !== null ? parseInt(typeof id === 'string' ? id : id[0]) : null;


    return (
        <View className="flex-1 bg-purple-300">
            <Stack.Screen options={{title:'Group Details',
                headerStyle: {
                    backgroundColor: "#EDF76A"
                },
                headerLeft: () => (
                    <Link href="/(tabs)/groups" asChild>
                        <Pressable >
                            <Text>Cancel</Text>
                        </Pressable>
                    </Link>
                  )
                }}
             />
             <View className='py-10 w-60 mx-auto'>
                <Link href={{
                    pathname:'/(tabs)/groups/friendsList',
                    params:{groupId: groupId}
                }}
                    asChild>
                    <Pressable className='border border-black rounded-full z-50 flex items-center'>
                            <Text>+ Add friend</Text>
                    </Pressable>
                </Link>
            </View>
            
            <FriendsScreen groupId={groupId} isGroup={true}/>

            <Link href={{pathname:"/add-expense/", params:{IDfromParams: groupId}}} asChild>
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


export default GroupDetailsScreen

const styles = StyleSheet.create({
   container: {
        backgroundColor:'white',
        flex:1, //apply white to the entire page
        padding: 10
   },
   
})