import React, { useEffect, useState, useCallback, useContext } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { EventId } from '../utils/event'
import produce from 'immer'
import UserContext from './UserContext'

type Stars = {
  bookStars: string[]
  circleStars: string[]
}
type StarKey = keyof Stars
type StarType = 'books' | 'circles'
export type UserStars = {
  [eventId in EventId]: Stars
}

const starTypeToKey: {
  [key in StarType]: StarKey
} = {
  circles: 'circleStars',
  books: 'bookStars'
}

const incrementStarCount = async (ref: firebase.firestore.DocumentReference, diff: number) => {
  const documentId = ref.path.replace('/', '-')
  const db = firebase.firestore()
  return db
    .collection('starCounts')
    .doc(documentId)
    .set({ ref, count: firebase.firestore.FieldValue.increment(diff) }, { merge: true })
}

const defaultStars = {
  bookStars: [], circleStars: []
}

export const StarsProvider: React.FC = ({ children }) => {
  const { user } = useContext(UserContext)
  const userId = user && user.uid || undefined
  const [userStars, setUserStars] = useState<UserStars>({
    gishohaku1: { bookStars: [], circleStars: [] },
    gishohaku2: { bookStars: [], circleStars: [] }
  })

  console.log(userStars.gishohaku1)

  useEffect(() => {
    if (!userId) return
    const fetchStars = async (userId: string): Promise<UserStars> => {
      // promise all
      const db = firebase.firestore()
      const stars1 = await db.doc(`users/${userId}/stars/gishohaku1`).get()
      const stars2 = await db.doc(`users/${userId}/stars/gishohaku2`).get()

      return {
        gishohaku1: { ...defaultStars, ...stars1.data() } as Stars,
        gishohaku2: { ...defaultStars, ...stars2.data() } as Stars,
      }
    }

    fetchStars(userId).then(res => {
      console.log(res)
      setUserStars(res)
    })
  }, [userId])

  const addStar = (eventId: EventId, starType: StarType, targetId: string) => {
    if (!userId) return
    const starKey = starTypeToKey[starType]
    console.log('before', userStars.gishohaku1)
    const newState = { ...userStars }
    newState[eventId][starKey] = [...newState[eventId][starKey], targetId]
    console.log('after', newState.gishohaku1)
    setUserStars(newState)

    const db = firebase.firestore()
    const targetRef = db.collection(starType).doc(targetId)
    incrementStarCount(targetRef, 1)

    db.doc(`users/${userId}/stars/${eventId}`).set({
      [starKey]: firebase.firestore.FieldValue.arrayUnion(targetId)
    }, { merge: true })
  }

  const removeStar = async (eventId: EventId, starType: StarType, targetId: string) => {
    if (!userId) return
    const starKey = starTypeToKey[starType]
    const newStars = produce(userStars, (draft) => {
      const stars = draft[eventId][starKey]
      stars.splice(stars.findIndex(s => s === targetId), 1)
    })
    console.log('newStars(remove)', newStars)

    const newState = { ...userStars }
    newState[eventId][starKey] = newState[eventId][starKey].filter(id => id !== targetId)
    console.log('after', newState.gishohaku1)
    setUserStars(newState)

    const db = firebase.firestore()
    const targetRef = db.collection(starType).doc(targetId)
    incrementStarCount(targetRef, -1)

    await db.doc(`users/${userId}/stars/${eventId}`).update({
      [starKey]: firebase.firestore.FieldValue.arrayRemove(targetId)
    })
  }

  return (
    <StarsContext.Provider
      value={{
        userStars,
        addStar,
        removeStar
      }}
    >
      {children}
    </StarsContext.Provider>
  )
}

type StarsContextType = {
  userStars: UserStars,
  addStar: (eventId: EventId, starType: StarType, targetId: string) => void,
  removeStar: (eventId: EventId, starType: StarType, targetId: string) => void
}

const StarsContext = React.createContext<StarsContextType>({
  userStars: {
    gishohaku2: {
      bookStars: [], circleStars: []
    },
    gishohaku1: {
      bookStars: [], circleStars: []
    }
  },
  addStar: () => { },
  removeStar: () => { }
} as any as StarsContextType)
export default StarsContext
