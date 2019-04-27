import axios from 'axios'
import Link from 'next/link'

import firebase, { firestore } from 'firebase'

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
  useEffect(() => {
    const db = firebase.firestore()
    db.collection('books').get().then(books => {
      books.forEach(book => {
        console.log(book.id, book.data())
      })
    })
    return () => {}
  }, [''])
  return (
    <Layout tab={props.router.query.tab}>
      <List>
        {props.posts.map(post => {
          return (
            <Link href={`/post?id=${post.id}`} key={post.id} passHref>
              <ListItem
                wrap={false}
                primary={post.title}
                secondary={post.description}
                key={post.id}
                contentAfter={<IconChevronRight />}
              />
            </Link>
          )
        })}
      </List>
    </Layout>
  )
}

Index.getInitialProps = async ({ req, res }) => {
  if (res) {
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate')
  }
  const data = [
    {
      id: 1,
      title: 'a',
      description: 'a',
    },
    {
      id: 2,
      title: 'b',
      description: 'b',
    },
  ]
  return {
    posts: data
  }
}

export default withRouter(Index)
