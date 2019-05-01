import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/firestore'

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
  return (
    <Layout tab={props.router.query.tab}>
      <List>
        {props.books.map((book: any) => {
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

Index.getInitialProps = async () => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      databaseURL: process.env.DATABASE_URL
    })
  }
  const db = firebase.database()
  const snapshot = await db.ref(`/books`).once('value')

  return {
    books: Object.values(snapshot.val())
  }

}

export default withRouter(Index)
