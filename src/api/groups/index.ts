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
`

export const ADD_GROUP_MEMBERS = gql`
  mutation AddGroupMembers($input: AddGroupMembersInput!) {
    addGroupMember(input: $input) {
      id
     group_id {
      id
     }
    }
}
`;
export const GET_GROUPS = gql`
  query GetGroups($userId: ID!) {
    groups(userId: $userId) {
      id 
      name
    }
  }
`

export const GET_GROUP_MEMBERS = gql`
  query GetGroupMembers($groupId: ID!) {
    groupMembers(groupId: $groupId) {
      id 
      username
    }
  }
`
