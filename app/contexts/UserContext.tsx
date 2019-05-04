import React, { useEffect, useState } from 'react';
import UserContext from './UserContext'
import firebase from 'firebase/app'
import 'firebase/auth'

export const UserProvider = (props: any) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    firebase.auth().onAuthStateChanged((currentUser) => {
      setCurrentUser(currentUser)
      setIsLoading(false)
    })
  }, [])

  return <UserContext.Provider value={{
    user: currentUser,
    isUserLoading: isLoading
  }}>
    {props.children}
  </UserContext.Provider >
}

export default React.createContext<{
  user: firebase.User | null
  isUserLoading: boolean
}>({
  user: null,
  isUserLoading: true
})