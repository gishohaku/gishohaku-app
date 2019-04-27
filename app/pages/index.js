import axios from 'axios'
import Link from 'next/link'

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

const Index = props => {
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
