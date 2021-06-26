import { useContext } from 'react'

import { db } from '../utils/firebase'
import Circle from '../utils/circle'
import Book, { refToId } from '../utils/book'
import CircleDetail from '../components/CircleDetail'
import SEO from '../components/SEO'
import { NextPage } from 'next'
import CircleSelect from '../components/CircleSelect'
import EventContext from '../contexts/EventContext'
import StarsContext from '../contexts/StarsContext'

interface Props {
  circle: Circle
  books: Book[]
}

const CirclePage: NextPage<Props> = (props) => {
  const { eventId } = useContext(EventContext)
  const { userStars } = useContext(StarsContext)
  const { circle, books } = props
  return (
    <>
      <SEO title={circle.name} imageUrl={circle.image} />
      <CircleSelect
        circleId={circle.id!}
        starIds={userStars[eventId].circleStars}
      />
      <CircleDetail
        circle={circle}
        books={books}
        editable={false}
        isShowSnsShare={true}
      />
    </>
  )
}

CirclePage.getInitialProps = async ({ query, res }) => {
  const { id, eventId } = query
  const circleRef = db.collection('circles').doc(id as string)
  const circleDoc = await circleRef.get()
  const circle = { id: circleDoc.id, ...circleDoc.data() } as Circle

  if (circle.eventId !== (eventId as string)) {
    if (res) {
      res.writeHead(301, {
        Location: `/${circle.eventId}/circles/${id}`,
      })
      res.end()
    }
  }

  const bookSnapshots = await db
    .collection('books')
    .where('circleRef', '==', circleRef)
    .orderBy('order', 'asc')
    .get()
  const books = bookSnapshots.docs.map((doc) => ({
    id: doc.id,
    ...refToId(doc.data() as Book),
  }))

  return { circle, books }
}

export default CirclePage
