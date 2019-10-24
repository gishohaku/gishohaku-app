/** @jsx jsx */
import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

import { jsx, css } from '@emotion/core'
import { useState, useCallback, useContext } from 'react'

import UserContext from '../contexts/UserContext'
import EventContext from '../contexts/EventContext'

const useCircleCopy = (fromCircleId: string, toCircleId: string) => {
  const [processing, setProcessing] = useState(false)

  const start = useCallback(async () => {
    setProcessing(true)
    const db = firebase.firestore()

    console.log('1')
    const fromCircleRef = db.collection('circles').doc(fromCircleId)
    const toCircleRef = db.collection('circles').doc(toCircleId)
    console.log('2')
    const toCricle = await toCircleRef.get()
    console.log('3')

    const getQuery = db.collection('books').where('circle.ref', '==', fromCircleRef)
    const books = await getQuery.get()

    books.docs.forEach(async (book) => {
      const { id, ...data } = book.data()
      const { name, booth } = toCricle.data()!
      const newBook = {
        ...data,
        circle: {
          ref: toCircleRef,
          name,
          booth
        },
        circleRef: toCircleRef,
        circleName: name,
        circleBooth: booth,
        eventId: 'gishohaku2'
      }
      db.collection('books').add(newBook)
    })
    setProcessing(false)
    console.log('DONE')
  }, [fromCircleId, toCircleId])

  return {
    processing,
    start
  }
}

const CircleCopyButton: React.FC = () => {
  const { userData } = useContext(UserContext)
  const { eventId } = useContext(EventContext)
  if (eventId !== 'gishohaku2') return null
  const fromCircleRef = userData!.event && userData!.event['gishohaku1']
  const toCircleRef = userData!.event && userData!.event[eventId]
  if (!fromCircleRef || !toCircleRef) return null
  const { processing, start } = useCircleCopy(fromCircleRef.id, toCircleRef.id)
  return <div>
    {fromCircleRef.path} => {toCircleRef.path}
    <button onClick={start}>copy</button>
  </div>
}

export default CircleCopyButton
