import React from "react";
import { Stack, Link } from "expo-router";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
export default function GroupsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
     
    </Stack>
  );
}