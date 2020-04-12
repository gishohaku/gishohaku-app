/** @jsx jsx */
import Link from 'next/link'

import { jsx, css } from '@emotion/core'
import { useEffect, useState, useContext } from 'react'

import Circle from '../utils/circle'
import Book, { refToId } from '../utils/book'
import MessageBox from '../components/MessageBox'
import Loader from '../components/Loader'
import CircleDetail from '../components/CircleDetail'

import withUser from '../withUser'
import { User } from '../contexts/UserContext'
import EventContext from '../contexts/EventContext'
import CircleCopyButton from '../components/CircleCopyButton'
import { db } from '../utils/firebase'

const Mypage: React.FC<{
  user: firebase.User
  userData: User
}> = ({ user, userData }) => {
  const [books, setBooks] = useState<Book[]>([])
  const [circle, setCircle] = useState<Circle>()
  const [isLoading, setLoading] = useState(true)
  const { eventId } = useContext(EventContext)
  const circleRef = userData.event && userData.event[eventId]

  useEffect(() => {
    setLoading(true)
    if (!circleRef) {
      setLoading(false)
      console.log('Not circle member', user, userData)
      return () => {}
    }
    ;(async () => {
      if (!circleRef) {
        return
      }
      const circleSnapShot = await circleRef.get()
      setCircle({ id: circleSnapShot.id, ...(circleSnapShot.data() as Circle) })
      const query = db
        .collection('books')
        .where('circle.ref', '==', circleRef)
        .orderBy('order', 'asc')
      const snapshots = await query.get()
      const books = snapshots.docs.map((book) => {
        const data = book.data() as Book
        return { ...refToId(data), id: book.id }
      })
      setBooks(books)
      setLoading(false)
    })()
  }, [userData])

  if (!circleRef) {
    return (
      <MessageBox
        title="サークル向けページです。"
        description="このページを利用するにはサークル主から招待URLを受け取ってください。"
      />
    )
  }

  if (isLoading || !circle) {
    return <Loader label="Loading..." />
  }

  return (
    <>
      <div
        css={css`
          max-width: ${1080 + 32}px;
          padding: 0 16px;
          margin: 32px auto;
        `}>
        {eventId === 'gishohaku1' && (
          <div
            css={css`
              background-color: white;
              padding: 20px;
              margin-top: 20px;
              background-color: #2a5773;
              color: white;
              a {
                color: inherit;
                font-weight: bold;
              }
              border-radius: 8px;
            `}>
            <p>
              このページはサークル参加者専用のページです。シェア用のページは
              <Link
                href={`/${eventId}/circles/[id]`}
                as={`/${eventId}/circles/${circle.id}`}>
                <a>こちら</a>
              </Link>
              。
            </p>
            {/* <p>シェアURL: https://gishohaku.dev/circles/{circle.id}</p> */}
          </div>
        )}
        {eventId === 'gishohaku2' && <CircleCopyButton />}
      </div>
      <CircleDetail
        circle={circle}
        books={books}
        editable={true}
        setBooks={setBooks}
      />
    </>
  )
}

export default withUser(Mypage)
