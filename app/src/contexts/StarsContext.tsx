import React, { useEffect, useState, useCallback, useContext } from 'react'
import { EventId } from '../utils/event'
import UserContext from './UserContext'
import { firebase, db } from '../utils/firebase'

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
  books: 'bookStars',
}

const incrementStarCount = async (
  eventId: EventId,
  ref: firebase.firestore.DocumentReference,
  diff: number,
) => {
  const documentId = ref.path.replace('/', '-')
  return db
    .collection('starCounts')
    .doc(documentId)
    .set(
      { ref, eventId, count: firebase.firestore.FieldValue.increment(diff) },
      { merge: true },
    )
}

const defaultStars = {
  bookStars: [],
  circleStars: [],
}

export const StarsProvider: React.FC = ({ children }) => {
  const { user } = useContext(UserContext)
  const userId = (user && user.uid) || undefined
  const [userStars, setUserStars] = useState<UserStars>({
    gishohaku1: { bookStars: [], circleStars: [] },
    gishohaku2: { bookStars: [], circleStars: [] },
    gishohaku3: { bookStars: [], circleStars: [] },
    gishohaku4: { bookStars: [], circleStars: [] },
    gishohaku5: { bookStars: [], circleStars: [] },
    gishohaku6: { bookStars: [], circleStars: [] },
    gishohaku7: { bookStars: [], circleStars: [] },
    gishohaku8: { bookStars: [], circleStars: [] },
    gishohaku9: { bookStars: [], circleStars: [] },
    gishohaku10: { bookStars: [], circleStars: [] },
    gishohaku11: { bookStars: [], circleStars: [] },
    gishohaku12: { bookStars: [], circleStars: [] },
  })

  useEffect(() => {
    if (!userId) return
    const fetchStars = async (userId: string): Promise<UserStars> => {
      // promise all
      const stars1 = await db.doc(`users/${userId}/stars/gishohaku1`).get()
      const stars2 = await db.doc(`users/${userId}/stars/gishohaku2`).get()
      const stars3 = await db.doc(`users/${userId}/stars/gishohaku3`).get()
      const stars4 = await db.doc(`users/${userId}/stars/gishohaku4`).get()
      const stars5 = await db.doc(`users/${userId}/stars/gishohaku5`).get()
      const stars6 = await db.doc(`users/${userId}/stars/gishohaku6`).get()
      const stars7 = await db.doc(`users/${userId}/stars/gishohaku7`).get()
      const stars8 = await db.doc(`users/${userId}/stars/gishohaku8`).get()
      const stars9 = await db.doc(`users/${userId}/stars/gishohaku9`).get()
      const stars10 = await db.doc(`users/${userId}/stars/gishohaku10`).get()
      const stars11 = await db.doc(`users/${userId}/stars/gishohaku11`).get()
      const stars12 = await db.doc(`users/${userId}/stars/gishohaku12`).get()

      return {
        gishohaku1: { ...defaultStars, ...stars1.data() } as Stars,
        gishohaku2: { ...defaultStars, ...stars2.data() } as Stars,
        gishohaku3: { ...defaultStars, ...stars3.data() } as Stars,
        gishohaku4: { ...defaultStars, ...stars4.data() } as Stars,
        gishohaku5: { ...defaultStars, ...stars5.data() } as Stars,
        gishohaku6: { ...defaultStars, ...stars6.data() } as Stars,
        gishohaku7: { ...defaultStars, ...stars7.data() } as Stars,
        gishohaku8: { ...defaultStars, ...stars8.data() } as Stars,
        gishohaku9: { ...defaultStars, ...stars9.data() } as Stars,
        gishohaku10: { ...defaultStars, ...stars10.data() } as Stars,
        gishohaku11: { ...defaultStars, ...stars11.data() } as Stars,
        gishohaku12: { ...defaultStars, ...stars12.data() } as Stars,
      }
    }

    fetchStars(userId).then((res) => {
      setUserStars(res)
    })
  }, [userId])

  const addStar = (eventId: EventId, starType: StarType, targetId: string) => {
    if (!userId) return
    const starKey = starTypeToKey[starType]
    const newState = { ...userStars }
    newState[eventId][starKey] = [...newState[eventId][starKey], targetId]
    setUserStars(newState)

    const targetRef = db.collection(starType).doc(targetId)
    incrementStarCount(eventId, targetRef, 1)

    db.doc(`users/${userId}/stars/${eventId}`).set(
      {
        [starKey]: firebase.firestore.FieldValue.arrayUnion(targetId),
      },
      { merge: true },
    )
  }

  const removeStar = async (
    eventId: EventId,
    starType: StarType,
    targetId: string,
  ) => {
    if (!userId) return
    const starKey = starTypeToKey[starType]
    const newState = { ...userStars }
    newState[eventId][starKey] = newState[eventId][starKey].filter(
      (id) => id !== targetId,
    )
    setUserStars(newState)

    const targetRef = db.collection(starType).doc(targetId)
    incrementStarCount(eventId, targetRef, -1)

    await db.doc(`users/${userId}/stars/${eventId}`).update({
      [starKey]: firebase.firestore.FieldValue.arrayRemove(targetId),
    })
  }

  return (
    <StarsContext.Provider
      value={{
        userStars,
        addStar,
        removeStar,
      }}>
      {children}
    </StarsContext.Provider>
  )
}

type StarsContextType = {
  userStars: UserStars
  addStar: (eventId: EventId, starType: StarType, targetId: string) => void
  removeStar: (eventId: EventId, starType: StarType, targetId: string) => void
}

const StarsContext = React.createContext<StarsContextType>(({
  userStars: {
    gishohaku12: {
      bookStars: [],
      circleStars: [],
    },
    gishohaku11: {
      bookStars: [],
      circleStars: [],
    },
    gishohaku10: {
      bookStars: [],
      circleStars: [],
    },
    gishohaku9: {
      bookStars: [],
      circleStars: [],
    },
    gishohaku8: {
      bookStars: [],
      circleStars: [],
    },
    gishohaku7: {
      bookStars: [],
      circleStars: [],
    },
    gishohaku6: {
      bookStars: [],
      circleStars: [],
    },
    gishohaku5: {
      bookStars: [],
      circleStars: [],
    },
    gishohaku4: {
      bookStars: [],
      circleStars: [],
    },
    gishohaku3: {
      bookStars: [],
      circleStars: [],
    },
    gishohaku2: {
      bookStars: [],
      circleStars: [],
    },
    gishohaku1: {
      bookStars: [],
      circleStars: [],
    },
  },
  addStar: () => {},
  removeStar: () => {},
} as any) as StarsContextType)
export default StarsContext
