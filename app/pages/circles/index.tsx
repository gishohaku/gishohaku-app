/** @jsx jsx */
import Link from 'next/link'
import { jsx, css, Global } from '@emotion/core'

import firebase from 'firebase/app'
import 'firebase/firestore'

import { Container, List, ListItem, IconChevronRight } from 'sancho'
import { withRouter } from 'next/router'

import circleTumbnail from '../../images/circle.png'

import { initFirebase, refToPath } from '../../utils/firebase'
import Circle, { categories } from '../../utils/circle'
import ImageBox from '../../components/ImageBox'

// TODO: ちゃんと作る
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
      <List>
        {props.circles.map((circle: Circle) => {
          return <ListItem
            contentBefore={<ImageBox size='circlecut' width={80} imageUrl={circle.image || circleTumbnail} />}
            primary={circle.name}
            secondary={[circle.name, categories[circle.category]].join(' | ')}
            contentAfter={<IconChevronRight />}
            key={circle.id}
          />
        })}
      </List>
    </Container>
  )
}

Index.getInitialProps = async ({ res }: any) => {
  if (res && res.setHeader) {
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate')
  }

  initFirebase()
  const db = firebase.firestore()
  const circles: Circle[] = []
  const circleSnapshots = await db.collection('circles').get()

  circleSnapshots.forEach(circle => {
    const data = circle.data() as Circle
    circles.push({
      id: circle.id,
      ...data
    })
  })

  return {
    circles
  }
}
export default withRouter(Index)
