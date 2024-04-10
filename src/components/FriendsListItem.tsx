import { StyleSheet, Text, Pressable, View, Image,ActivityIndicator} from "react-native";
import { Link } from "expo-router";
import { useState , useEffect} from "react";
import { FriendExpense, User } from "../constants/type";
import { GET_USER } from "../api/friends";
import { useQuery } from "@apollo/client";

export const defaultAvatarPath = require("../../assets/images/emoji.png")

const FriendsListItem = ({id, amt}: FriendExpense) => {
  // console.log("received in friendlistitem", id)
  const [userDetails, setUserDetails] = useState<User>()
  
  const { loading: getUserLoading, error: getUserError, data } = useQuery(GET_USER, {
    variables: { id: id }, 
    onCompleted: (data) => {
      setUserDetails(data.profile)
    }
  });



    return (
      <View>
        <Link href={`/(tabs)/friends/${userDetails?.username}`} asChild>
          <Pressable style={styles.friendContainer}>
            <View style={styles.friendTitle}>
              <Image source={userDetails?.avatar_url || defaultAvatarPath} style={{width: 30, height:30}}/>
              <Text style={styles.friendName}>{userDetails?.username}</Text>
            </View>
    
            <View style={styles.friendSubtitle}>
              {amt > 0 ?
                <Text className="text-green-700">
                  owes you ${amt}
                </Text>: 
                 <Text className="text-red-700">
                  you owe ${Math.abs(amt)}
               </Text>
              }
          
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