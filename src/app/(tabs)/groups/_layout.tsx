import React from "react";
import { Stack, Link } from "expo-router";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
export default function GroupsLayout() {
  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <Link href="/(tabs)/groups/add-groups" asChild>
            <Pressable>
            <AntDesign name="addusergroup" size={24} color="black" />
            </Pressable>
          </Link>
        )
      }}>
        
      <Stack.Screen name="index" options={{ 
        title:'Groups', 
        headerTintColor:'black',
        headerStyle: {
          backgroundColor: "#EDF76A"
        },
        headerBackButtonMenuEnabled:false
        }}/>
  
     <Stack.Screen name='expenses' options={{ headerShown: false }} />
    </Stack>
  );
}