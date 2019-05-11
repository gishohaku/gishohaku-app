import React, { useEffect, useState, useCallback } from 'react';
import UserContext from './UserContext'
import firebase from 'firebase/app'
import 'firebase/auth'

interface User {
  email: string
  displayName: string
  circleRef?: firebase.firestore.DocumentReference
}


const fetchUserData = async (db: firebase.firestore.Firestore, uid: string) => {
  return new Promise((resolve, reject) => {
    console.log('fetchUser', uid)
    db.collection('users').doc(uid).get().then((snapshot) => {
      console.log(snapshot.exists ? 'success' : 'failed')
      snapshot.exists ? resolve(snapshot.data()) : setTimeout(() => reject('Error'), 3000)
    })
  })
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
        const userData = await Promise.reject()
          .catch(() => fetchUserData(db, user.uid))
          .catch(() => fetchUserData(db, user.uid))
          .catch(() => fetchUserData(db, user.uid))
          .catch(() => fetchUserData(db, user.uid))
          .catch(() => fetchUserData(db, user.uid))
        setUserData(userData as User)
      }
      // TODO: 会員登録直後isLoadingがfalseにならないケースがある
      setIsLoading(false)
    })
  }, [])

  const reloadUser = useCallback(() => {
    if (currentUser) {
      const db = firebase.firestore()
      return fetchUserData(db, currentUser.uid).then((_userData) => {
        setUserData(_userData as User)
      })
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
}>({
  user: null,
  isUserLoading: true,
  userData: null
})