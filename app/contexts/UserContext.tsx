import React, { useEffect, useState, useCallback } from 'react';
import UserContext from './UserContext'
import firebase, { FirebaseError } from 'firebase/app'
import 'firebase/auth'

interface User {
  email: string
  displayName: string
  photoURL: string
  circleRef?: firebase.firestore.DocumentReference
  createdAt: firebase.firestore.FieldValue
}

export const UserProvider = (props: any) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      setIsLoading(true)
      setCurrentUser(user)
      if (user) {
        const db = firebase.firestore()
        const userSnapshot = await db.collection('users').doc(user.uid).get()
        if (userSnapshot.exists) {
          setUserData(userSnapshot.data() as User)
        } else {
          const userDoc = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          }
          await db.collection('users').doc(user.uid).set(userDoc)
          console.log('Create user document')
          setUserData(userDoc as User)
        }
      }
      setIsLoading(false)
    })
  }, [])

  const reloadUser = useCallback(async () => {
    if (currentUser) {
      const db = firebase.firestore()
      const userSnapshot = await db.collection('users').doc(currentUser.uid).get()
      setUserData(userSnapshot.data() as User)
    }
  }, [currentUser])

  return <UserContext.Provider value={{
    user: currentUser,
    userData,
    isUserLoading: isLoading,
    reloadUser,
  }}>
    {props.children}
  </UserContext.Provider >
}

export default React.createContext<{
  user: firebase.User | null
  isUserLoading: boolean,
  userData: User | null,
  reloadUser: () => void
}>({
  user: null,
  isUserLoading: true,
  userData: null,
  reloadUser: () => {}
})