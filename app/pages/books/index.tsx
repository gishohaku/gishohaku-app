/** @jsx jsx */
import Link from 'next/link'
import { jsx, css, Global } from '@emotion/core'

import firebase from 'firebase/app'
import 'firebase/firestore'

import {
  Container
} from 'sancho'
import { withRouter } from 'next/router'
import { initFirebase, refToPath } from '../../utils/firebase'
import Book from '../../utils/book'
import BookCell from '../../components/BookCell'

const Index = (props: any) => {
  return (
    <Container css={css`
      max-width: 720px;
      margin-top: 32px;
    `}>
      <Global styles={{
        body: {
          backgroundColor: "#F7F8FA"
        }
      }} />
      {props.books.map((book: Book) => (<BookCell book={book} key={book.id} />))}
    </Container>
  )
}

Index.getInitialProps = async ({ res }: any) => {
  if (res && res.setHeader) {
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate')
  }

  initFirebase()
  const db = firebase.firestore()
  const books: Book[] = []
  const bookSnapshots = await db.collection('books').get()

  bookSnapshots.forEach(book => {
    const data = book.data() as Book
    books.push({
      id: book.id,
      ...refToPath(data, 'circleRef')
    })
  })

  return {
    books
  }
}
export default withRouter(Index)
