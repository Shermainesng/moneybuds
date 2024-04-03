import { gql } from '@apollo/client';

export const ADD_GROUP = gql`
  mutation AddGroup($input: AddGroupInput!) {
    addGroup(input: $input) {
      id
      name
      created_by {
        id
        username
      }
    }
}
`;