import React from "react";
import { Stack, Link } from "expo-router";
import { View, Pressable } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";

export default function FriendsLayout() {
  return (
    <Stack 
      screenOptions={{
        headerRight: () => (
          <Link href="/(tabs)/friends/add-friends" asChild>
            <Pressable>
            <AntDesign name="adduser" size={24} color="black" />
            </Pressable>
          </Link>
        )
      }}
      >
      
      <Stack.Screen name="index" options={{ 
        title:'Friends', 
        headerTintColor:'black',
        headerStyle: {
          backgroundColor: "#EDF76A"
        }
        }}/>
  
    </Stack>
  );
}