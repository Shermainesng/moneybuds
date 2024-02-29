import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import Account from '../components/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import React from "react";
// import { NativeBaseProvider, Text, Box } from "native-base";
import { Redirect } from 'expo-router';
import { useAuth } from '../providers/AuthProvider'

export default function Index() {
  const {session, loading, profile} = useAuth()
  console.log("session here")
  console.log(session)

  if (!session) {
    return <Redirect href={'/auth/sign-in'}/>
  }
  return <Redirect href='/(tabs)/groups' />
}