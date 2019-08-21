/** @jsx jsx */
import { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import firebase from 'firebase/app'
import 'firebase/firestore'

import { jsx, css } from '@emotion/core'

import { Button, Container } from 'sancho'

import UserContext from '../../../contexts/UserContext'
import MessageBox from '../../../components/MessageBox'
import Loader from '../../../components/Loader'
import Book from '../../../utils/book'
import BookCell from '../../../components/BookCell'
import { refToPath } from '../../../utils/firebase'
import { media } from '../../../utils/style'

const AsnycBookCell = ({ bookId }: any) => {
  const [book, setBook] = useState<Book | null>(null)

  useEffect(() => {
    const db = firebase.firestore()
    db.collection('books')
      .doc(bookId)
      .get()
      .then(snapshot => {
        const book = { id: snapshot.id, ...(snapshot.data() as Book) }
        if (snapshot.exists) {
          setBook(refToPath(book, 'circleRef'))
        }
      })
  }, [bookId])

  return book ? <BookCell isShowCircle={true} book={book} /> : null
}

const BookStars: React.FC = () => {
  const { user, isUserLoading, bookStars } = useContext(UserContext)

  if (isUserLoading) {
    return <Loader label="Loading..." />
  }

  // withUserみたいなHOCに置き換える
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

  return (
    <Container
      css={css`
        max-width: 720px;
        margin: 32px auto;
        padding: 0 16px;
        @media ${media.small} {
          padding-left: 0;
          padding-right: 0;
        }
      `}
    >
      {bookStars.map(bookId => (
        <AsnycBookCell bookId={bookId} key={bookId} />
      ))}
    </Container>
  )
}

export default BookStars
