/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { db } from '../utils/firebase'
import Book, { refToId } from '../utils/book'
import CircleDetail from '../components/CircleDetail'
import SEO from '../components/SEO'
import CircleSelect from '../components/CircleSelect';
import EventContext from '../contexts/EventContext';
import StarsContext from '../contexts/StarsContext';
import useCircle from '../hooks/useCircle';

const useBooks = (circleRef: any) => {
  const [books, setBooks] = useState<Book[]>([])
  useEffect(() => {
    if (!circleRef) return
    db.collection('books')
      .where('circleRef', '==', circleRef)
      .orderBy('order', 'asc')
      .get()
      .then((snapshot) => {
        const books = snapshot.docs.map(doc => ({
          id: doc.id,
          ...refToId(doc.data() as Book)
        }))
        setBooks(books)
      })
  }, [circleRef])

  return { books }
}

const CirclePage = () => {
  const { eventId } = useContext(EventContext)
  const { userStars } = useContext(StarsContext)
  const router = useRouter()

  const id = router.query.id as string
  // FirebaseのRewriteを用いているためquery.idが[id]になる瞬間があるための対応。
  const { circle, circleRef } = useCircle(id === '[id]' ? undefined : id)
  const { books } = useBooks(circleRef)
  console.log(router, circle, books)

  return (
    <>
      {circle && <>
        <SEO title={circle.name} imageUrl={circle.image} />
        <CircleSelect circleId={circle.id!} router={router} starIds={userStars[eventId].circleStars} />
        <CircleDetail circle={circle} books={books} editable={false} isShowSnsShare={true} />
      </>}
    </>
  )
}

export default CirclePage
