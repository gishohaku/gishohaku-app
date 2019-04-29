import Link from 'next/link'


import firebase from 'firebase/app'
import 'firebase/firestore'
// import firebase, { firestore } from 'firebase'

import {
  List,
  ListItem,
  Button,
  IconChevronRight,
  InputGroup,
  Input,
  TextArea,
  Container,
} from 'sancho'
import Layout from '../../components/layout'
import router, { withRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface Book {
  id: string
  title: string
}

const Index = (props: any) => {
  const [books, setBooks] = useState<Book[]>([])

  useEffect(() => {
    const db = firebase.firestore!()
    db.collection('books').get().then(bookSnapshots => {
      const books: Book[] = []
      bookSnapshots.forEach(book => {
        books.push({
          id: book.id,
          ...book.data()
        } as Book)
      })
      setBooks(books)
    })
    return () => { }
  }, [''])

  return (
    <Layout tab={props.router.query.tab}>
      <List>
        {books.map((book: any) => {
          return (
            <Link href={`/books/book?id=${book.id}`} key={book.id} passHref>
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
    </Layout>
  )
}

export default withRouter(Index)
