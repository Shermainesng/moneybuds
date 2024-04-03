import { View, Text } from "react-native"
import { Stack, useLocalSearchParams} from "expo-router"

const GroupDetailsScreen = () => {
    const {id: groupId} = useLocalSearchParams()
    // const id = parseFloat(typeof groupId == 'string' ? groupId:groupId[0])
    console.log(groupId)
    return (
        <View>
            <Stack.Screen options={{title:'Group Details',
            headerStyle: {
                backgroundColor: "#EDF76A"
              }}}
             />

           <Text>reached group details page</Text> 
            
        </View>
    )
}

export default GroupDetailsScreen