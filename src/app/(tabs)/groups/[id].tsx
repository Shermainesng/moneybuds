import { View, Text, TouchableOpacity, Pressable, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { Stack, useLocalSearchParams} from "expo-router"
import {useState} from 'react'
import { Link } from "expo-router"

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