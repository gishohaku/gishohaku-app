import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/database'

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
    const db = firebase.database()
    db.ref(`/books`).once('value').then((snapshot) => {
       setBooks(Object.values(snapshot.val()))
    })
    return () => { }
  }, [''])

  return (
    <Layout tab={props.router.query.tab}>
      <List>
        {books.map((book: any) => {
          return (
            <Link href={`/books/_id?id=${book.title}`} key={book.title} passHref as={`/books/${book.title}`}>
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
