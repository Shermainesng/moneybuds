import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Pressable, StyleSheet, Alert} from "react-native";
import React, {useEffect, useState} from "react";
import { Stack } from "expo-router";
import { Ionicons, AntDesign} from "@expo/vector-icons";
import * as Contacts from 'expo-contacts'
// import { useGetContactsWithAccounts } from "@/src/api/friends";
import { User } from "@/src/constants/type";
import { ADD_FRIEND, GET_FRIENDS, GET_PROFILES_WITH_PHONE_NUMBERS } from "@/src/api/friends";
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from "@/src/providers/AuthProvider";

export default function AddFriendsScreen() {
  const {session} = useAuth()
  const userId:string | undefined = session?.user.id
  const [contacts, setContacts] = useState<User[] | null>([])

  const {loading: getProfilesLoading, error: getProfilesError, data: getProfiles} = useQuery(GET_PROFILES_WITH_PHONE_NUMBERS, {
    fetchPolicy: 'network-only',
  });
  const [addFriend, {loading, error:addFriendError}] = useMutation(ADD_FRIEND)

  //when component first loads, render list of contacts that have an account
  useEffect(() => {
    const fetchData = async () => {
        try {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers],
                });

                if (data.length > 0) {
                    const phones:string[] = []
                    data.forEach(contact => contact.phoneNumbers && phones.push(contact.phoneNumbers[0].number as string));
                    
                    let filteredContacts: User[] = []
                    if (getProfiles && getProfiles.profiles) {
                      filteredContacts = getProfiles.profiles?.filter((user: User) => {
                          return phones.some(phone => {
                              const normalizedUserPhone = normalizePhoneNumber(user.phone_number);
                              const normalizedContactPhone = normalizePhoneNumber(phone);
                              return normalizedUserPhone === normalizedContactPhone;
                          });
                      }) || [];
                    }
                    
                    if (!getProfilesError) {
                        console.log(filteredContacts)
                        setContacts(filteredContacts);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchData();
}, [getProfiles, getProfilesError]);
  
  function normalizePhoneNumber(phoneNumber: string): string {
    // Remove non-digit characters from phone number
    const digitsOnly = phoneNumber.replace(/\D/g, '');

    // If the phone number starts with a country code, remove it
    if (digitsOnly.length > 8 && digitsOnly.startsWith('65')) {
        return digitsOnly.slice(2); // Remove '65'
    }
    
    return digitsOnly;
}

  const handleAddFriend = async(contactId:String) => {
    console.log('in handleAddFriend', userId, contactId)
    try {
      const response = await addFriend({
        variables: {
          input: {
            "user_id": userId,
            "friend_id": contactId, 
            "status": "confirmed"
          }
        }
      })
      if (response && response.data.addFriend === true) {
        console.log("Friend added successfully!", response.data);
        Alert.alert("Friend has been added!")
    } else {
        console.error("Mutation may not have been successful:", response.data);
    }
    } catch(err) {
      console.error("Error adding expense:", addFriendError);
    }
    if (addFriendError) {
      console.error("GraphQL Error:", addFriendError);
    }
  }

  return (
    <SafeAreaView className="mb-24">
     
      <View className="bg-white m-2 border rounded-3xl p-2 flex-row items-center">
        <Ionicons name="search" size={20} color="black" />
        <Text className="pl-1">Add friends from your contacts</Text>
      </View>
      <View style={styles.addNewContact}>
        <Pressable>
          <AntDesign name="adduser" size={24} color="black" />
        </Pressable>
        <Text>Add a new contact to splitwise</Text>
      </View>
      <ScrollView className="px-3">
        <Text style={{paddingBottom:10}}>From your contacts:</Text>
        {contacts && contacts.length > 0 &&
          contacts.map(contact => (
            <View className='flex-row justify-between pb-2' key={contact.id}>
              <View>
                <Text className="text-base">{contact.username}</Text>
                <Text>{contact.phone_number}</Text>
              </View>
              <View>
                {/* <Button text='Add as friend'></Button> */}
                <TouchableOpacity onPress={() => handleAddFriend(contact.id)} style={styles.container}>
                  <Text>Add as friend</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addNewContact: {
    flexDirection:'row',
    alignItems:'center', 
    justifyContent:'center',
    padding:10
  },
    container: {
      backgroundColor:'#FDD7E9',
      padding: 10,
      alignItems: 'center',
      borderRadius: 100,
      // marginVertical: 10,
    },
    text: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
    },
})
