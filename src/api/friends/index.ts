import { supabase } from "@/src/lib/supabase";
import {useQuery} from '@tanstack/react-query'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { gql } from '@apollo/client';

export const ADD_FRIEND = gql`
  mutation AddFriend($input: AddFriendInput!) {
    addFriend(input: $input)
}
`;

export const GET_PROFILES_WITH_PHONE_NUMBERS = gql`
    query GetUsers {
      profiles {
        id
        username
        phone_number
      }
}
`

export const useGetUserProfile = (userId: any) => {
    return useQuery({
        queryKey: ['user', userId], 
        queryFn:async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, avatar_url, username')
                .eq('id', userId);
        
            // console.log("self list", data[0]);
        
            if (error) {
                throw new Error(error.message);
            }
        
            return data[0]
        }
    });
}
//get friendIDs of user
export const useGetFriendsList= (userId:any) => {
    return useQuery({
        queryKey: ['friends', userId], 
        queryFn:async () => {
            const { data, error } = await supabase
                .from('friends')
                .select('friend_id')
                .eq('user_id', userId);
        
            // console.log("friends list", data);
        
            if (error) {
                throw new Error(error.message);
            }
        
            return data.map(d => d.friend_id)
        }
    });
  };
  
  //for each friend ID, get friend's details
  export const useGetFriendDetails = (userId:any) => {
    return useQuery({
        queryKey: ['friend', userId], 
        queryFn:async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', userId)
                .single()
                                
                if (error) {
                    throw new Error(error.message);
                }

                return Array.isArray(data) ? data[0] : data;
        }
    })
  }

  export const useGetFriendsProfiles= (friendIds: []) => {
    return useQuery({
        queryKey: ['allFriends', friendIds], 
        queryFn:async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, avatar_url')
                .in('id', friendIds)
             
            // console.log("friends list", data);
        
            if (error) {
                throw new Error(error.message);
            }
        
            return data
        }
    });
  };

  //getting phone numbers of all my users with phone numbers
  export const useGetContactsWithAccounts = () => {
    return useQuery({
        queryKey: ['existingPhones'], 
        queryFn:async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .not('phone_number', 'is', null)
                // console.log("existing users", data)
                
                if (error) {
                    throw new Error(error.message);
                }

                return data
        }
    })
  }