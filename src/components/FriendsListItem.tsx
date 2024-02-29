import { StyleSheet, Text, Pressable, View } from "react-native";
import { Link } from "expo-router";


const FriendsListItem = ({item}: any) => {
    return (
        <Link href={`/(tabs)/friends/${item.name}`} asChild>
          <Pressable style={styles.friendContainer}>
            <View style={styles.friendTitle}>
              {/* <Avatar circular size="$4">
                <Avatar.Image src={item.imageUrl} />
                <Avatar.Fallback bc="grey" />
              </Avatar> */}
              <Text style={styles.friendName}>{item.name}</Text>
            </View>
    
            <View style={styles.friendSubtitle}>
              <Text style={styles.subValue}>{item.status}</Text>
              <Text style={styles.subValue}>${item.amount}</Text>
            </View>
          </Pressable>
        </Link>
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