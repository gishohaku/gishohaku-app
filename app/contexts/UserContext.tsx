import React, { useEffect, useState, useCallback } from 'react'
import UserContext from './UserContext'
import firebase from 'firebase/app'
import 'firebase/auth'

interface User {
  uid: string
  email: string
  displayName: string
  photoURL: string
  circleRef?: firebase.firestore.DocumentReference
  createdAt: firebase.firestore.FieldValue
}

const incrementStarCount = async (ref: firebase.firestore.DocumentReference, diff: number) => {
  const db = firebase.firestore()
  const documentId = ref.path.replace('/', '-')
  return db
    .collection('starCounts')
    .doc(documentId)
    .set(
      {
        ref,
        count: firebase.firestore.FieldValue.increment(diff)
      },
      { merge: true }
    )
}

export const UserProvider = (props: any) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<User | null>(null)
  const [bookStars, setBookStars] = useState<string[]>([])
  const [circleStars, setCircleStars] = useState<string[]>([])

  const fetchBookStars = async (user: firebase.User) => {
    const db = firebase.firestore()
    const snapshots = await db.collection(`users/${user.uid}/bookStars`).get()
    const starIds: string[] = []
    snapshots.forEach(snapshot => {
      const { bookRef } = snapshot.data()
      starIds.push(bookRef.id)
    })
    setBookStars(starIds)
  }

  const fetchCircleStars = async (user: firebase.User) => {
    const db = firebase.firestore()
    const snapshots = await db.collection(`users/${user.uid}/circleStars`).get()
    const starIds: string[] = []
    snapshots.forEach(snapshot => {
      const { circleRef } = snapshot.data()
      starIds.push(circleRef.id)
    })
    setCircleStars(starIds)
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async user => {
      setIsLoading(true)
      setCurrentUser(user)
      if (user) {
        console.log(user.uid)
        const db = firebase.firestore()
        const userSnapshot = await db
          .collection('users')
          .doc(user.uid)
          .get()
        if (userSnapshot.exists) {
          setUserData({
            uid: user.uid,
            ...(userSnapshot.data() as User)
          })
        } else {
          const userDoc = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          }
          await db
            .collection('users')
            .doc(user.uid)
            .set(userDoc)
          console.log('Create user document')
          setUserData(userDoc as User)
        }
        fetchBookStars(user)
        fetchCircleStars(user)
      }
      setIsLoading(false)
    })
  }, [])

  const reloadUser = useCallback(async () => {
    if (currentUser) {
      const db = firebase.firestore()
      const userSnapshot = await db
        .collection('users')
        .doc(currentUser.uid)
        .get()
      setUserData(userSnapshot.data() as User)
    }
  }, [currentUser])

  const addBookStar = async (bookId: string) => {
    if (!currentUser) {
      return
    }
    const db = firebase.firestore()
    setBookStars([...bookStars, bookId])
    const bookRef = db.collection('books').doc(bookId)
    incrementStarCount(bookRef, 1)
    return await db.collection(`users/${currentUser.uid}/bookStars`).doc(bookId).set({
      bookRef: db.collection('books').doc(bookId),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
  }

  const addCircleStar = async (circleId: string) => {
    if (!currentUser) {
      return
    }
    const db = firebase.firestore()
    setCircleStars([...circleStars, circleId])
    const circleRef = db.collection('circles').doc(circleId)
    incrementStarCount(circleRef, 1)
    return await db.collection(`users/${currentUser.uid}/circleStars`).doc(circleId).set({
      circleRef: db.collection('circles').doc(circleId),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
  }

  const removeBookStar = async (bookId: string) => {
    if (!currentUser) {
      return
    }
    const db = firebase.firestore()
    setBookStars(bookStars.filter(staredBookId => staredBookId !== bookId))
    const bookRef = await db.collection('books').doc(bookId)
    incrementStarCount(bookRef, -1)
    return db
      .collection(`users/${currentUser.uid}/bookStars`)
      .doc(bookId).delete()
  }

  const removeCircleStar = async (circleId: string) => {
    if (!currentUser) {
      return
    }
    const db = firebase.firestore()
    setCircleStars(circleStars.filter(staredCircleId => staredCircleId !== circleId))
    const circleRef = await db.collection('circles').doc(circleId)
    incrementStarCount(circleRef, -1)
    return db
      .collection(`users/${currentUser.uid}/circleStars`)
      .doc(circleId).delete()
  }

  return (
    <UserContext.Provider
      value={{
        user: currentUser,
        userData,
        isUserLoading: isLoading,
        reloadUser,
        addBookStar,
        removeBookStar,
        bookStars,
        addCircleStar,
        removeCircleStar,
        circleStars
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}

export default React.createContext<{
  user: firebase.User | null
  isUserLoading: boolean
  userData: User | null
  reloadUser: () => void
  bookStars: string[]
  addBookStar: (bookId: string) => Promise<any>
  removeBookStar: (bookId: string) => Promise<any>
  circleStars: string[]
  addCircleStar: (bookId: string) => Promise<any>
  removeCircleStar: (bookId: string) => Promise<any>
}>({
  user: null,
  isUserLoading: true,
  userData: null,
  reloadUser: () => {},
  bookStars: [],
  addBookStar: () => Promise.resolve(),
  removeBookStar: () => Promise.resolve(),
  circleStars: [],
  addCircleStar: () => Promise.resolve(),
  removeCircleStar: () => Promise.resolve()
})
