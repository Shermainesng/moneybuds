import { FlatList } from "react-native";

import { expenses } from "../constants/Data";
import ExpensesListItem from "./ExpensesListItem";

export default function ExpensesList({ friendName }: any) {
  const data = expenses.filter(expense => {
    if (expense.paid_by == friendName || expense.owed_by == friendName) return expense;
  });

  return <FlatList data={data ? data : []} showsVerticalScrollIndicator={false} renderItem={({ item }) => <ExpensesListItem expense={item} />} />;
}