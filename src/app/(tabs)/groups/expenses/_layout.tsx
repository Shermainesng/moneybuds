import { Stack } from 'expo-router';
import * as React from 'react';

export interface IExpensesStackProps {
}

export default function ExpensesStack (props: IExpensesStackProps) {
  return (
    <Stack>
         <Stack.Screen name='index' options={{ title: "Member expense" }} />
         <Stack.Screen name='[id]' options={{ title: "Expense Details" }} />
    </Stack>
  );
}
