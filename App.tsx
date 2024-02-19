import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { View, Text } from "react-native"
import { supabase } from './lib/supabase'
import Auth from './src/components/Auth'
// import Account from './src/components/Account'
import AccountScreen from './src/app/AccountScreen'
import { Session } from '@supabase/supabase-js'
import {NavigationContainer} from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

function HomeScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
  
  function SettingsScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }


const Tab = createBottomTabNavigator()

export default function Hello() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (session && session.user) {
    return (
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Friends" component={HomeScreen} />
            <Tab.Screen name="Groups" component={SettingsScreen} />
            <Tab.Screen name="Activity" component={SettingsScreen} />
            <Tab.Screen name="Account" component={AccountScreen} initialParams={{session: session}}/>
          </Tab.Navigator>
    </NavigationContainer>
    )
  } else {
    return <Auth/>
  }
}