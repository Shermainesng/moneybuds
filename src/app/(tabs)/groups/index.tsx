import { View, Text, ImageBackground, StyleSheet, FlatList, Pressable, TouchableOpacity, ScrollView } from "react-native";
import { groups } from "@/src/constants/Data"
import FriendsListItem from "@/src/components/FriendsListItem";
import { Link, Stack } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";

export default function IndexScreen() {
  return (
    <View className="flex-1 bg-purple-300">
      
      <FlatList data={groups} keyExtractor={(item, index) => item.name + index} renderItem={({ item }) => <FriendsListItem item={item} />} onEndReachedThreshold={1} contentInsetAdjustmentBehavior="automatic" />

      <Link href={'/add-expense/'} asChild>
        <Pressable className="border border-black rounded-full bg-[#EDF76A] absolute bottom-[2px] p-2 right-[41vw] z-50">
          <Ionicons name="add" size={35} color="black" />
        </Pressable>
      </Link>
      <View className="border border-black rounded-full bg-black absolute bottom-[0px] p-2 right-[40vw] z-40">
        <Ionicons name="add" size={35} color="black" />
      </View>
    </View>
  );
}