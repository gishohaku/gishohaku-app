import Link from 'next/link'

import firebase from 'firebase/app'

import {
  List,
  ListItem,
  IconChevronRight,
} from 'sancho'
import Layout from '../../components/layout'
import { withRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface Book {
  id: string
  title: string
}

const Index = (props: any) => {
  const [books, setBooks] = useState<Book[]>([])

  useEffect(() => {
    // const db = firebase.firestore()
    // db.collection('books').get().then(bookSnapshots => {
    //   const books: Book[] = []
    //   bookSnapshots.forEach(book => {
    //     books.push({
    //       id: book.id,
    //       ...book.data()
    //     } as Book)
    //   })
    //   setBooks(books)
    // })
    return () => { }
  }, [''])

  return (
    <Layout tab={props.router.query.tab}>
      <List>
        {books.map((book: any) => {
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
    </Layout>
  )
}

export default withRouter(Index)
