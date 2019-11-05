import React, { useEffect, useState, useCallback } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { EventId } from '../utils/event'
import produce from 'immer'

type Stars = {
  bookStars: string[]
  circleStars: string[]
}

type StarKey = keyof Stars

type UserStars = {
  [eventId in EventId]: Stars
}


const db = firebase.firestore()

const incrementStarCount = async (ref: firebase.firestore.DocumentReference, diff: number) => {
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

const defaultStars = {
  bookStars: [], circleStars: []
}

export const StarsProvider: React.FC<{
  userId: string
}> = ({ userId, children }) => {
  const [userStars, setUserStars] = useState<UserStars>({
    gishohaku1: { bookStars: [], circleStars: [] },
    gishohaku2: { bookStars: [], circleStars: [] }
  })

  useEffect(() => {
    if (!userId) return
    const fetchStars = async (userId: string): Promise<UserStars> => {
      // promise all
      const stars1 = await db.doc(`users/${userId}/stars/gishohaku1`).get()
      const stars2 = await db.doc(`users/${userId}/stars/gishohaku2`).get()

      return {
        gishohaku1: { ...defaultStars },
        gishohaku2: { ...defaultStars },
      }

      // データが存在しない時の対応
      return {
        gishohaku1: { ...defaultStars, ...stars1.data() } as Stars,
        gishohaku2: { ...defaultStars, ...stars2.data() } as Stars,
      }
    }

    fetchStars(userId).then(res => {
      setUserStars(res)
    })
  }, [userId])

  const addStar = (eventId: EventId, starKey: StarKey, targetId: string) => {
    if (!userId) return

    const newStars = produce(userStars, (draft) => {
      if (!draft) return
      draft[eventId][starKey].push(targetId)
    })
    setUserStars(newStars)

    // TODO
    // const circleRef = db.collection('circles').doc(circleId)
    // incrementStarCount(circleRef, 1)

    db.doc(`users/${userId}/stars/${eventId}`).set({
      [starKey]: firebase.firestore.FieldValue.arrayUnion(targetId)
    }, { merge: true })
  }

  const removeStar = async (eventId: EventId, starKey: StarKey, targetId: string) => {
    const newStars = produce(userStars, (draft) => {
      if (!draft) return
      const stars = draft[eventId][starKey]
      stars.splice(stars.findIndex(s => s === targetId), 1)
    })
    setUserStars(newStars)

    // TODO:
    // incrementStarCount

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
  addStar: (eventId: EventId, starKey: StarKey, targetId: string) => void,
  removeStar: (eventId: EventId, starKey: StarKey, targetId: string) => void
}

const StarsContext = React.createContext<StarsContextType>({} as any as StarsContextType)
export default StarsContext
