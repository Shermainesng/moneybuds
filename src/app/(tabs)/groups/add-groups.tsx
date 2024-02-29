import { View, Text, TouchableOpacity, Keyboard, TextInput } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Ionicons, Foundation } from "@expo/vector-icons";

export default function AddGroupsScreen() {
  return (
    <View className="flex-1 items-center pt-20">
      <Stack.Screen
        options={{
          title: "new group",
          headerStyle: { backgroundColor: "#EDF76A" },
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons name="add" size={30} color="black" />
            </TouchableOpacity>
          )
        }}
      />

      <TouchableOpacity className="items-center px-5 py-3 border border-dashed border-black bg-pink-50" onPress={Keyboard.dismiss}>
        <Foundation name="camera" size={40} color="black" />
        <Text className="text-sm w-20 text-center">add group photo</Text>
      </TouchableOpacity>

      <View className="pt-10">
        <TextInput className="text-lg" value="group expense name" />
        <TextInput className="text-lg" value="group members" />
      </View>
    </View>
  );
}