import { StyleSheet, Text, Pressable, View, Image,ActivityIndicator} from "react-native";
import { Link } from "expo-router";
import { useGetFriendDetails } from "../api/friends";

// export const defaultAvatar = () => {
//   return <Image source={require("../../assets/images/emoji.png")}/>
// }

// type Friend={
//   username:string
//   avatar_url:string | null
// }
export const defaultAvatarPath = require("../../assets/images/emoji.png")

const FriendsListItem = ({item}: any) => {
  const {friend_id} = item
  const {data: friend, error, isLoading} = useGetFriendDetails(friend_id)

  if (isLoading) {
    return <ActivityIndicator/>
  }

  if (error) {
      return <Text>Failed to fetch products</Text>
  }
    return (
      <View>
        <Link href={`/(tabs)/friends/${friend.username}`} asChild>
          <Pressable style={styles.friendContainer}>
            <View style={styles.friendTitle}>
              <Image source={friend.avatar_url || defaultAvatarPath} style={{width: 30, height:30}}/>
              <Text style={styles.friendName}>{friend.username}</Text>
            </View>
    
            <View style={styles.friendSubtitle}>
              {/* <Text style={styles.subValue}>{item.status}</Text> */}
              {/* <Text style={styles.subValue}>${item.amount}</Text> */}
            </View>
          </Pressable>
        </Link>
        </View>
      );
}

export default FriendsListItem

const styles = StyleSheet.create({
    friendContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
  
      backgroundColor: "#fff",
      padding: 8,
      paddingHorizontal: 20,
      marginHorizontal: 0,
  
      // shadow
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
  
      elevation: 2
    },
    friendTitle: { flexDirection: "row", alignItems: "center", gap: 20 },
    friendName: {
      fontSize: 17,
      fontWeight: "500"
    },
    friendSubtitle: {
      alignItems: "flex-end",
      color: "dimgray"
    },
    subValue: {
      // textTransform: "capitalize"
    }
  });