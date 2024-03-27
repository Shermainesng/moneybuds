import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import Button from '@/src/components/Button';
import Colors from '@/src/constants/Colors';
import { Link, Stack } from 'expo-router';
import { supabase } from '@/src/lib/supabase';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState<boolean>(false)

  async function signUpWithEmail() {
    setLoading(true)
    const {data, error} = await supabase.auth.signUp({
      email, 
      password
    })
    if (error) Alert.alert(error.message)
    console.log(data.session?.user.id)

    await supabase.from('profiles').update({ username, phone_number:phone}).eq('id', data.session?.user.id);
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Sign up' }} />

      <Text style={styles.label}>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Jon Doe"
        style={styles.input}
      />

      <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="9999 9999"
          style={styles.input}
          keyboardType="numeric"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="jon@gmail.com"
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder=""
        style={styles.input}
        secureTextEntry
      />

      <Button onPress={signUpWithEmail} disabled={loading} text={loading ? 'Creating...':"Create account"}/>
      <Link href={"/auth/sign-in" }style={styles.textButton}>
        Sign in
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
});

export default SignUpScreen;