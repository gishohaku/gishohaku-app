import React, { useEffect, useState } from 'react';
import UserContext from './UserContext'
import firebase from 'firebase/app'
import 'firebase/auth'

export const UserProvider = (props: any) => {
  const [currentUser, setCurrentUser] = useState()

  useEffect(() => {
    firebase.auth().onAuthStateChanged((currentUser) => {
      setCurrentUser(currentUser)
    })
  }, [])

  return <UserContext.Provider value={currentUser}>
    {props.children}
  </UserContext.Provider>
}

export default React.createContext(null)