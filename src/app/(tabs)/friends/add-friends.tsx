import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Pressable, StyleSheet} from "react-native";
import React, {useEffect, useState} from "react";
import { Stack } from "expo-router";
import { Ionicons, AntDesign} from "@expo/vector-icons";
import * as Contacts from 'expo-contacts'
import { useGetContactsWithAccounts } from "@/src/api/friends";

type User = {
  id: string;
  avatar_url: string | null;
  full_name: string | null;
  phone_number: string;
  updated_at: string | null;
  username: string;
  website: string | null;
}
export default function AddFriendsScreen() {
  const phones:string[] = []
  const  {data: existingPhones, error} = useGetContactsWithAccounts()
  const [contacts, setContacts] = useState<User[] >([])


  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          data.forEach(contact => contact.phoneNumbers && phones.push(contact.phoneNumbers[0].number as string))
          
          const filteredContacts = existingPhones?.filter(user => {
            return phones.some(phone => normalizePhoneNumber(user.phone_number).includes(normalizePhoneNumber(phone)));
          });
          // console.log(filteredContacts)
          // console.log(phones)
          if (!error) setContacts(filteredContacts)
          }
      }
    })();
  }, []);

  function normalizePhoneNumber(phoneNumber:string) {
    // Remove non-numeric characters from the phone number
    return phoneNumber.replace(/\D/g, '');
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
            <View>
              <Text className="text-base ">{contact.username}</Text>
              <Text>{contact.phone_number}</Text>
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
  }
})