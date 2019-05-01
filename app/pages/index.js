import axios from 'axios'
import Link from 'next/link'

import firebase from 'firebase/app'

import { jsx, css, Global } from '@emotion/core'
import {
  Layer,
  Toolbar,
  Text,
  Navbar,
  DarkMode,
  Tabs,
  Tab,
  List,
  ListItem,
  IconChevronRight
} from 'sancho'
import Layout from '../components/layout'
import { withRouter } from 'next/router'
import { useEffect } from 'react'

const Index = props => {
  // useEffect(() => {
  //   const db = firebase.firestore()
  //   db.collection('books').get().then(books => {
  //     books.forEach(book => {
  //       console.log(book.id, book.data())
  //     })
  //   })
  //   return () => {}
  // }, [''])
  return (
    <Layout tab={props.router.query.tab}>
      <List>
        <Link href={`/books`} passHref>
          <ListItem
            wrap={false}
            primary={'Books'}
            secondary={'book list'}
            contentAfter={<IconChevronRight />}
          />
        </Link>
      </List>
    </Layout>
  )
}

Index.getInitialProps = async ({ req, res }) => {
  if (res && res.setHeader) {
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate')
  }
  return {}
}

export default withRouter(Index)
