import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/firestore'

import {
  List,
  ListItem,
  IconChevronRight,
} from 'sancho'
import Layout from '../../components/layout'
import { withRouter } from 'next/router'

interface Book {
  id: string
  title: string
}

const Index = (props: any) => {
  return (
    <Layout tab={props.router.query.tab}>
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
    </Layout>
  )
}

Index.getInitialProps = async ({res}: any) => {
  if (res && res.setHeader) {
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate')
  }

  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      databaseURL: process.env.DATABASE_URL
    })
  }
  const db = firebase.firestore()
  const books : Book[] = []
  const bookSnapshots= await db.collection('books').get()

  bookSnapshots.forEach(book => {
    books.push({
      id: book.id,
      ...book.data()
    } as Book)
  })

  return {
    books
  }
}

export default withRouter(Index)
