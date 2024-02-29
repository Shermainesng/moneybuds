import {useState} from 'react'
import { StyleSheet, View } from 'react-native';
import Button from '@/src/components/Button';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { Redirect } from 'expo-router';

export default function SettingsPage() {
  const {session} = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  console.log('session in settings')
  console.log(session)


  const handleSignOut = async () => {
    setIsLoading(true)
    console.log('clicked on sign out');
    await supabase.auth.signOut();
    setIsLoading(false)
  };

  if (!session) {
    // If user is not logged in, redirect to sign-in page
    return <Redirect href={'/auth/sign-in'} />;
  }


  return (
    <View style={styles.container}>
      <Button onPress={handleSignOut} disabled={!isLoading} text="Sign Out"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
