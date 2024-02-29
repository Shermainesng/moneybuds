import { StyleSheet, View, Text } from "react-native";

export default function ActivityListItem({ item }: any) {
  return (
    <View style={styles.expenseContainer}>
      <Text style={styles.expenseName}>{item.lineOne}</Text>

      <View>
        <Text style={styles.subValue}>{item.lineTwo}</Text>
        <Text style={(styles.subValue, { color: "gray", fontSize: 12 })}>{item.lineThree}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  expenseContainer: {
    backgroundColor: "#fff",
    padding: 10,
    // borderRadius: 10,
    marginHorizontal: 2,
    gap: 1,

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
  expenseName: {
    fontSize: 17,
    fontWeight: "500"
  },
  expenseSubtitle: {
    // alignItems: "flex-end",
    color: "dimgray"
  },
  subValue: {
    // textTransform: "capitalize"
  }
});
