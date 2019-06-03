/** @jsx jsx */
import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

import { jsx, css } from '@emotion/core'

import { withRouter } from 'next/router'
import { refToPath } from '../../utils/firebase'
import { initFirebase } from '../../utils/firebase'
import Circle, { categories } from '../../utils/circle'
import Book, { types, mediums } from '../../utils/book'
import CircleDetail from '../../components/CircleDetail'
import SEO from '../../components/SEO'
import { NextFunctionComponent, NextContext } from 'next'

interface Props {
  circle: Circle
  books: Book[]
}

const CirclePage: NextFunctionComponent<Props> = props => {
  // const [books, setBooks] = useState<Book[]>([])
  // const [circle, setCircle] = useState<Circle>()
  const { circle, books } = props

  return (
    <>
      <SEO title={circle.name} />
      <CircleDetail circle={circle} books={books} editable={false} />
    </>
  )
}

CirclePage.getInitialProps = async (
  context: NextContext<{
    id: string
  }>
) => {
  initFirebase()
  const id: string = context.query.id
  if (!id) {
    // TODO: リダイレクトの処理
  }
  const db = firebase.firestore()
  const circleRef = db.collection('circles').doc(id)
  const circle = await circleRef.get()
  const snapshots = await db
    .collection('books')
    .where('circleRef', '==', circleRef)
    .get()
  let books: Book[] = []
  snapshots.forEach(book => {
    const data = book.data()
    books.push({
      id: book.id,
      ...(refToPath(data, 'circleRef') as Book)
    })
  })
  console.log(circle)

  return {
    circle: {
      id: circle.id,
      ...circle.data()
    },
    books
  }
}

export default withRouter(CirclePage)
