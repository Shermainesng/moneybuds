import React from 'react'
import Account from "../components/Account"


export default function AccountScreen({route}) {
    const {session} = route.params
    return (
      <Account key={session.user.id} session={session}/>
    )
  }
  