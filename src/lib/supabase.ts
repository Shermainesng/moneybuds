import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jecatujziyybwubikulz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplY2F0dWp6aXl5Ynd1YmlrdWx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwNDY4MjksImV4cCI6MjAyMzYyMjgyOX0._Hz16c-LDmguqHINmks8paG7RvPBlXUs_VFOG6h-wCg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})