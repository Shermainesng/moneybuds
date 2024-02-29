import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text } from 'react-native';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import Colors from '../../constants/Colors'
import { useColorScheme } from '../../components/useColorScheme'
import { useClientOnlyValue } from '../../components/useClientOnlyValue'

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
        <Tabs.Screen
        name="friends"
        options={{
          headerShown: false,
          // title: "friends",
          tabBarIcon: ({ color }) => (
            <AntDesign name='user' size={20} color={color}/>
          )
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          headerShown: false,
          // title: "friends",
          tabBarIcon: ({ color }) => (
            <AntDesign name='addusergroup' size={20} color={color}/>
          )
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          // title: "activity",
          tabBarIcon: ({ color }) => <Text style={{ color }}>activity</Text>
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          // title: "activity",
          tabBarIcon: ({ color }) => <Text style={{ color }}>settings</Text>
        }}
      />
       {/* <Tabs.Screen name="index" options={{ href: null }} /> */}

    </Tabs>
  );
}
