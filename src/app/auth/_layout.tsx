import {Redirect, Stack} from 'expo-router'
import { useAuth } from '@/src/providers/AuthProvider'

export default function AuthLayout() {
    const {session} = useAuth()
    //if user alr signed in, stop showing them the signin/signup page, redirect them to the index screen
    if(session) {
        return <Redirect href={'/'}/>
    }
    return <Stack/>
}