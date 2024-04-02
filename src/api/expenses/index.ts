
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
//given a user id, get all the expense IDs from the Expense Member table that user is a part of
// export const GET_EXPENSE_IDS = gql`
//   query GetExpenseMember($id:ID!) {
//     expenseMembersByUserId(id: $id) 
//   }
// `
//from the array of expense IDs, query the Expense Member table again and get expense members details for those expense IDs, and filter out those where member_id === user.id
export const GET_EXPENSE_MEMBERS_BY_EXPENSEID = gql`
  query GetExpenseMemberByExpenseId($user_id: ID!) {
    expenseMembersByExpenseIds(user_id: $user_id) {
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