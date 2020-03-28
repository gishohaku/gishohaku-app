import React, { useEffect, useState, useCallback } from 'react'
import UserContext from './UserContext'
import LoginSheet from '../components/LoginSheet'
import { EventId } from '../utils/event'
import { firebase, db } from '../utils/firebase'

export interface User {
  uid: string
  email: string
  displayName: string
  photoURL: string
  circleRef?: firebase.firestore.DocumentReference
  createdAt: firebase.firestore.FieldValue
  event?: {
    [eventId in EventId]: firebase.firestore.DocumentReference
  }
}

export const UserProvider = (props: any) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<User | null>(null)
  const [isOpenModal, setModal] = useState<boolean>(false)

  useEffect(() => {
    const auth: firebase.auth.Auth = firebase.auth()
    auth.onAuthStateChanged(async (user) => {
      setIsLoading(true)
      setCurrentUser(user)
      if (user) {
        console.log(user.uid)
        const userSnapshot = await db.collection('users').doc(user.uid).get()
        if (userSnapshot.exists) {
          setUserData({
            uid: user.uid,
            ...(userSnapshot.data() as User),
          })
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
      const userSnapshot = await db
        .collection('users')
        .doc(currentUser.uid)
        .get()
      setUserData(userSnapshot.data() as User)
    }
  }, [currentUser])

  const openLoginModal = () => setModal(true)

  return (
    <UserContext.Provider
      value={{
        user: currentUser,
        userData,
        isUserLoading: isLoading,
        reloadUser,
        openLoginModal,
      }}>
      <LoginSheet onRequestClose={() => setModal(false)} isOpen={isOpenModal} />
      {props.children}
    </UserContext.Provider>
  )
}

export default React.createContext<{
  user: firebase.User | null
  isUserLoading: boolean
  userData: User | null
  reloadUser: () => void
  openLoginModal: () => void
}>({
  user: null,
  isUserLoading: true,
  userData: null,
  reloadUser: () => {},
  openLoginModal: () => {},
})
