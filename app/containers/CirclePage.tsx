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
    console.log(circleRef)
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
  const { circle, circleRef } = useCircle(router.query.id as string)
  const { books } = useBooks(circleRef)

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
