import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import AuthProvider from '../providers/AuthProvider';
import QueryProvider from '../providers/QueryProvider';
import { useColorScheme } from '../components/useColorScheme'

import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(isProduction)

  const uri = isProduction
  ? 'https://moneybuds-graphql.onrender.com/graphql' // Production URI
  : 'http://192.168.1.87:4000/graphql'; // Local URI


  const client = new ApolloClient({
    // uri: 'http://192.168.1.87:4000/graphql',
    // uri: 'https://moneybuds-graphql.onrender.com/graphql', 
    uri,
    cache: new InMemoryCache()
  });
  
  console.log("apollo client", client)
  const colorScheme = useColorScheme();
  return (
    // <TamaguiProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ApolloProvider client={client}>
      <AuthProvider>
        <QueryProvider>
      <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="add-expense" options={{ presentation: "modal", headerShown: false }} />
          {/* <Stack.Screen name="add-friends" options={{ presentation: "modal" }} /> */}
          {/* <Stack.Screen name="add-groups" options={{ presentation: "modal" }} /> */}
      </Stack>
      </QueryProvider>
      </AuthProvider>
      </ApolloProvider>
    </ThemeProvider>
    // </TamaguiProvider>
  );
}

// AppRegistry.registerComponent('MyApplication', () => RootLayoutNav);