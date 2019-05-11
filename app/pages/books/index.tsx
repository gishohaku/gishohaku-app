import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/firestore'

import {
  List,
  ListItem,
  IconChevronRight,
} from 'sancho'
import { withRouter } from 'next/router'
import { initFirebase, refToPath } from '../../utils/firebase'
import Book from '../../utils/book'

const Index = (props: any) => {
  return (
    <>
      <Link href='/books/new'><span>new Book</span></Link>
      <List>
        {props.books.map((book: any) => {
          return (
            <Link href={`/books/_id?id=${book.id}`} key={book.id} passHref as={`/books/${book.id}`}>
              <ListItem
                wrap={false}
                primary={book.title}
                secondary={book.description}
                key={book.id}
                contentAfter={<IconChevronRight />}
              />
            </Link>
          )
        })}
      </List>
    </>
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
