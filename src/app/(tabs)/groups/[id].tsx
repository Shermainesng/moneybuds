import { View, Text, TouchableOpacity, Pressable, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { Stack, useLocalSearchParams} from "expo-router"
import {useState} from 'react'
import { Link } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

const GroupDetailsScreen = () => {
    const {id: groupId} = useLocalSearchParams()
    const [showFriendsList, setShowFriendsList] = useState<boolean>(false)
    const id = parseFloat(typeof groupId == 'string' ? groupId:groupId[0])

    return (
        <View style={styles.container}>
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
            
            <Link href={{pathname:"/add-expense/", params:{groupId: groupId}}} asChild>
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