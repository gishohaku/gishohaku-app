/** @jsx jsx */
import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

import { jsx, css } from '@emotion/core'
import { useState, useCallback, useContext } from 'react'

import UserContext from '../contexts/UserContext'
import EventContext from '../contexts/EventContext'
import { Button } from 'sancho'

const useCircleCopy = (fromCircleId: string, toCircleId: string) => {
  const [processing, setProcessing] = useState(false)

  const start = useCallback(async () => {
    setProcessing(true)

    if (!confirm('頒布物のインポートを行います。この操作は取り消せません。')) {
      setProcessing(false)
      return
    }
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

    location.reload()
    setProcessing(false)
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
  return <div css={css`
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    border-radius: 8px;
    background-color: white;
    padding: 12px 20px;
    display: flex;
    align-items: center;
  `}>
    技書博1からの頒布物のインポートを行えます。
    <Button loading={processing} onClick={start} css={css`
      margin-left: auto;
    `}>インポート</Button>
  </div>
}

export default CircleCopyButton
