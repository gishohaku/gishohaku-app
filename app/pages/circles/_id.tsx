/** @jsx jsx */
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

import { jsx } from '@emotion/core'

import { refToPath } from '../../utils/firebase'
import { initFirebase } from '../../utils/firebase'
import Circle from '../../utils/circle'
import Book from '../../utils/book'
import CircleDetail from '../../components/CircleDetail'
import SEO from '../../components/SEO'
import { NextPage } from 'next'
import { withRouter, NextRouter } from 'next/router';
import CircleSelect from '../../components/CircleSelect';
import { useContext } from 'react';
import UserContext from '../../contexts/UserContext';

interface Props {
  circle: Circle
  books: Book[]
}

const CirclePage: NextPage<Props & { router: NextRouter }, Props> = props => {
  const { circleStars } = useContext(UserContext)
  const { circle, books, router } = props
  return (
    <>
      <SEO title={circle.name} imageUrl={circle.image} />
      <CircleSelect circleId={circle.id!} router={router} starIds={circleStars} />
      <CircleDetail circle={circle} books={books} editable={false} />
    </>
  )
}

CirclePage.getInitialProps = async context => {
  initFirebase()
  const id = context.query.id as string
  if (!id) {
    // TODO: リダイレクトの処理
  }
  const db: firebase.firestore.Firestore = firebase.firestore()
  const circleRef = db.collection('circles').doc(id)
  const circle = await circleRef.get()
  const snapshots = await db
    .collection('books')
    .where('circleRef', '==', circleRef)
    .orderBy('order', 'asc')
    .get()
  let books: Book[] = []
  snapshots.forEach(book => {
    const data = book.data()
    books.push({
      id: book.id,
      ...(refToPath(data, 'circleRef') as Book)
    })
  })

  return {
    circle: {
      id: circle.id,
      ...circle.data()
    } as Circle,
    books
  }
}

export default withRouter(CirclePage)
