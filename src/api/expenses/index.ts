
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
export const GET_EXPENSE_IDS = gql`
  query GetExpenseMember($id:ID!) {
    expenseMembersByUserId(id: $id) 
  }
`
export const GET_EXPENSE_MEMBERS_BY_EXPENSEID = gql`
  query GetExpenseMemberByExpenseId($expense_ids: [ID!], $user_id: ID!) {
    expenseMembersByExpenseIds(expense_ids: $expense_ids, user_id: $user_id) {
        id
        isOwed
        owes
        expense_id {
          id 
          payer_id {
            id
          }
          description
        }
        member_id {
          id
          username
        }
    }
  }
`