import React, { useEffect, useState, useCallback } from 'react';
import UserContext from './UserContext'
import firebase from 'firebase/app'
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
  const [bookStars, setBookStars] = useState<string[]> ([])

  const fetchBookStars = async (user: firebase.User) => {
    const db = firebase.firestore()
    const snapshots = await db.collection(`users/${user.uid}/bookStars`).get()
    const starIds: string[] = []
    snapshots.forEach(snapshot => {
      const {bookRef} = snapshot.data()
      starIds.push(bookRef.id)
    })
    setBookStars(starIds)
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      setIsLoading(true)
      setCurrentUser(user)
      if (user) {
        console.log(user.uid)
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
        fetchBookStars(user)
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

  const addBookStar = async (bookId: string) => {
    if (!currentUser) { return }
    const db = firebase.firestore()
    setBookStars([...bookStars, bookId])
    return await db.collection(`users/${currentUser.uid}/bookStars`).add({
      bookRef: db.collection('books').doc(bookId),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
  }

  const removeBookStar = async (bookId: string) => {
    if (!currentUser) { return }
    const db = firebase.firestore()
    setBookStars(bookStars.filter((staredBookId) => staredBookId !== bookId))
    const bookRef = db.collection('books').doc(bookId)
    const snapshots = await db.collection(`users/${currentUser.uid}/bookStars`).where("bookRef", "==", bookRef).get()
    return snapshots.forEach(star => star.ref.delete())
  }

  return <UserContext.Provider value={{
    user: currentUser,
    userData,
    isUserLoading: isLoading,
    reloadUser,
    addBookStar,
    removeBookStar,
    bookStars,
  }}>
    {props.children}
  </UserContext.Provider >
}

export default React.createContext<{
  user: firebase.User | null
  isUserLoading: boolean,
  userData: User | null,
  reloadUser: () => void
  bookStars: string[],
  addBookStar: (bookId: string) => Promise<any>,
  removeBookStar: (bookId: string) => Promise<any>

}>({
  user: null,
  isUserLoading: true,
  userData: null,
  reloadUser: () => {},
  bookStars: [],
  addBookStar: (bookId) => Promise.resolve(),
  removeBookStar: (bookId) => Promise.resolve()
})