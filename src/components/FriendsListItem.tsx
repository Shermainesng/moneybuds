import { StyleSheet, Text, Pressable, View, Image,ActivityIndicator} from "react-native";
import { Link } from "expo-router";
import { useState , useEffect} from "react";
import { FriendExpense, User } from "../constants/type";
import { GET_USER } from "../api/friends";
import { useQuery } from "@apollo/client";
import { client } from "../app/_layout";
import { useAuth } from "@/src/providers/AuthProvider";

type NetAmtOwedByEachPersonProps = {
  person: string
  debts: {[person: string]: number} //debt is an object 
} 

export const defaultAvatarPath = require("../../assets/images/emoji.png")

const FriendsListItem = ({person, debts}:NetAmtOwedByEachPersonProps ) => {
  const {session} = useAuth()
    const userId = session?.user.id
    // console.log("received in FriendsListItem", person, debts)
  const [userDetails, setUserDetails] = useState<User>()
  const [debtorDetails, setDebtorDetails] = useState<User[]>()
  const [amounts, setAmounts] = useState<number[]>(Object.values(debts))

  //person = 'sam'
  //get amount owed by person into an array: [-0.5]
  //get the person (debtor) that the person owes into an array: [{"__typename": "Profile", "id": "77a1444f-c581-48c8-85ee-2415105296b4", "username": "Dini"}]
  
  useEffect(() => {
    const fetchDebtorDetails = async () => {
      const newDebtorDetails: User[] = [];
      const promises = Object.keys(debts).map(async (debtorId) => {
        const { data } = await client.query({
          query: GET_USER,
          variables: { id: debtorId }
        });
        console.log("debtor:", data.profile)
        newDebtorDetails.push(data.profile);
      });
      try {
        await Promise.all(promises);
        console.log("user updated", newDebtorDetails)
        setDebtorDetails(newDebtorDetails);
      } catch (error) {
        console.error('Error fetching debtor details:', error);
      }
    };

    fetchDebtorDetails();
  }, [debts]);

  const { loading: getUserLoading, error: getUserError, data: userData} = useQuery(GET_USER, {
    variables: { id: person }, 
    onCompleted: (data) => {
      setUserDetails(data.profile)
    }
  });


    return (
      <View>
        <Link 
         href={{
          pathname: `/(tabs)/friends/${userDetails?.id}`, 
          params: { name: userDetails?.username }
        }} asChild>
          <Pressable style={styles.friendContainer}>
            <View style={styles.friendTitle}>
              <Image source={userDetails?.avatar_url || defaultAvatarPath} style={{width: 30, height:30}}/>
              <Text style={styles.friendName}>{userDetails?.username}</Text>
            </View>
    
            <View style={styles.friendSubtitle}>

            {
              amounts.length>0 && debtorDetails && debtorDetails.length>0 && amounts.map((amt, index)=> (
                <View key={index}>
                  {amt < 0 ? 
                    <Text>{debtorDetails[index].id === userId ? <Text className="text-red-700">you owe</Text>: `${debtorDetails[index].username} owes`} {userDetails?.id === userId ? "you":userDetails?.username} ${Math.abs(amt)}</Text>
                    :<Text>{debtorDetails[index].id === userId ? <Text className="text-green-700"> owes you</Text>: <Text>owes debtorDetails[index].username</Text>} ${amt}</Text>
                  }
                </View>
              ))
            }
              {/* in groups setting */}
              {/* {amount > 0 ?
                <Text className="text-green-700">
                  {userDetails?.username} owes {debtorDetails?.username} ${amount}
                </Text>: 
                 <Text className="text-red-700">
                  {debtor} owes {person} ${Math.abs(amount)}
               </Text>
              } */}
          
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