/** @jsx jsx */
import { useContext, useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'

import { jsx, css } from '@emotion/core'

import { Container } from 'sancho'

import UserContext from '../contexts/UserContext'
import Book, { refToId } from '../utils/book'
import BookCell from '../components/BookCell'
import { media } from '../utils/style'
import withUser from '../withUser'

const AsnycBookCell = ({ bookId }: any) => {
  const [book, setBook] = useState<Book | null>(null)

  useEffect(() => {
    const db = firebase.firestore()
    db.collection('books')
      .doc(bookId)
      .get()
      .then(snapshot => {
        const data = snapshot.data() as Book
        const book = { id: snapshot.id, ...data }
        if (snapshot.exists) {
          setBook(refToId(book))
        }
      })
  }, [bookId])

  return book ? <BookCell isShowCircle={true} book={book} /> : null
}

const BookStars: React.FC = () => {
  const { bookStars } = useContext(UserContext)

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

export default withUser(BookStars)
