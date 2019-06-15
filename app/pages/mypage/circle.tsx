/** @jsx jsx */
import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

import { jsx, css } from '@emotion/core'
import { useContext, useEffect, useState } from 'react'

import { Button, Container, IconChevronRight } from 'sancho'
import { withRouter, WithRouterProps } from 'next/router'
import { refToPath } from '../../utils/firebase'
import Circle, { categories } from '../../utils/circle'
import Book, { types, mediums } from '../../utils/book'
import UserContext from '../../contexts/UserContext'
import MessageBox from '../../components/MessageBox'
import Loader from '../../components/Loader'
import CircleDetail from '../../components/CircleDetail'

const Mypage: React.FC = () => {
  const { user, isUserLoading, userData } = useContext(UserContext)
  const [books, setBooks] = useState<Book[]>([])
  const [circle, setCircle] = useState<Circle>()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (!user || !userData || !userData.circleRef) {
      setLoading(false)
      console.log('Not circle member', user, userData)
      return () => {}
    }
    const db = firebase.firestore()
    ;(async () => {
      const circleRef = userData.circleRef!
      const circleSnapShot = await circleRef.get()
      setCircle({ id: circleSnapShot.id, ...(circleSnapShot.data() as Circle) })
      const snapshots = await db
        .collection('books')
        .where('circleRef', '==', circleRef)
        .orderBy('order', 'asc')
        .get()
      let bookResults: Book[] = []
      snapshots.forEach(book => {
        const data = book.data()
        bookResults.push({
          id: book.id,
          ...(refToPath(data, 'circleRef') as Book)
        })
      })
      setBooks(bookResults)
      setLoading(false)
    })()
  }, [userData])

  // console.log(isLoading, isUserLoading, books)

  if (userData && !userData.circleRef) {
    return (
      <MessageBox
        title="サークル向けページです。"
        description="このページを利用するにはサークル主から招待URLを受け取ってください。"
      />
    )
  }

  if (isLoading || isUserLoading) {
    return <Loader label="Loading..." />
  }

  if (!user) {
    return (
      <MessageBox
        title="ログインが必要です。"
        description="このページを利用するにはログインが必要です。"
      >
        <Link href="/sign_in" passHref>
          <Button
            component="a"
            css={css`
              margin-top: 12px;
              width: 100%;
            `}
          >
            ログイン
          </Button>
        </Link>
      </MessageBox>
    )
  }

  if (!circle) {
    return <Loader label="Loading..." />
  }
  return <CircleDetail circle={circle} books={books} editable={true} setBooks={setBooks} />
}

export default withRouter(Mypage)
