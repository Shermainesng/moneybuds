import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import Account from '../components/Account'
import { View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import React from "react";
// import { NativeBaseProvider, Text, Box } from "native-base";
import { Redirect } from 'expo-router';
import { useAuth } from '../providers/AuthProvider'
import { AppRegistry } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useQuery, gql } from '@apollo/client';


// console.log(client)

// client
//   .query({
//     query: gql`
//       query GET_USERS {
//         profiles {
//           id
//           username
//         }
//       }
//     `,
//   })
//   .then((result) => console.log(result.data.profiles));

// const GET_USERS = gql`
//   query GetUsers {
//       profiles {
//         id
//         username
//       }
//   }
// `;

// const GET_USER = gql`
//   query GetUser($id: ID!) {
//     profile(id: $id) {
//       id,
//       username
//     }
//   }
// `

export default function Index() {
  const {session, profile} = useAuth()

  // const {loading, error, data} = useQuery(GET_USERS)
  // if (error) {
  //   console.log(error)
  // }
  // console.log("data here", data)


  if (!session) {
    return <Redirect href={'/auth/sign-in'}/>
  }
  return (
      <View>
        <Text>Hello!</Text>
      </View>
    )
}