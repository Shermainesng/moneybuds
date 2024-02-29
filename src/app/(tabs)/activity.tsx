import { View, StyleSheet, FlatList, ImageBackground } from "react-native";
import { activities } from "@/src/constants//Data"
import ActivityListItem from "@/src/components/ActivityListItem"
import { Stack } from "expo-router";

export default function ActivityScreen() {
  return (
    <View className="flex-1 bg-[#EDF76A]">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "activity",
          headerTintColor: "black",
          headerStyle: {
            backgroundColor: "rgb(216 180 254)"
          }
          // headerSearchBarOptions: {}
        }}
      />

      <FlatList data={activities} contentContainerStyle={{ gap: 5 }} style={{ padding: 10 }} keyExtractor={(item, index) => item.lineOne + index} renderItem={({ item }) => <ActivityListItem item={item} />} onEndReachedThreshold={1} contentInsetAdjustmentBehavior="automatic" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'contain' for different scaling options
    justifyContent: "center" // Adjust as needed
  }
});
