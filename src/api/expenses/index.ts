
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { gql } from '@apollo/client';

export const ADD_EXPENSE = gql`
  mutation addExpense($input: ExpenseInput!) {
    addExpense(input: $input) {
      id
      payer_id {
        id
        username
      }
      amount
      description
      date
    }
  }
`;

export const ADD_EXPENSEMEMBER = gql`
mutation addExpenseMember($input: [ExpenseMemberInput]) {
  addExpenseMember(input: $input) {
    expense_id {
      id
    }
    member_id {
      id
    }
    isOwed
    owes
  }
}
`