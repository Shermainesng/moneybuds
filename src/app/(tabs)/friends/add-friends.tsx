import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AddFriendsScreen() {
  const contacts = ["Ahn Ye-won", "An Min-young", "Cha Hyun-seung", "Cho Min-ji", "Choi Hye-seon", "Choi Jong-woo", "Choi Min-woo", "Choi Seo-eun", "Choi Si-hun", "Jo Yoong-jae", "Kang So-yeon", "Kim Gyu-ri", "Kim Han-bin", "Kim Hyeon-joong", "Kim Jin-young", "Kim Jun-sik", "Kim Se-jun", "Kim Su-min", "Lee Gwan-hee", "Lee Jin-seok", "Lee Nadine", "Lee So-e", "Lim Min-su", "Moon Se-hoon", "Oh Jin-taek", "Park Min-kyu", "Park Se-jeong", "Seong Min-ji", "Shin Dong-woo", "Shin Ji-yeon", "Shin Seul-ki", "Son Won Ik", "Song Ji-a", "Yu Si-eun", "Yun Ha-bin", "Yun Ha-jeong"];
  return (
    <SafeAreaView className="mb-24">
      <Stack.Screen
        options={{
          title: "add friends",
          headerStyle: { backgroundColor: "#EDF76A" },
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons name="add" size={30} color="black" />
            </TouchableOpacity>
          )
        }}
      />
      <View className="bg-white m-2 border rounded-3xl p-2 flex-row items-center">
        <Ionicons name="search" size={20} color="black" />
        <Text className="pl-1">search friends from contacts list</Text>
      </View>
      <ScrollView className="px-3">
        {contacts.length > 0 &&
          contacts.map(contact => {
            return <Text className="text-base py-2">{contact}</Text>;
          })}
      </ScrollView>
    </SafeAreaView>
  );
}
