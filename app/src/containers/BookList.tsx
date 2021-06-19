import { useState, useContext } from 'react'
import { NextPage } from 'next'
import firebase from 'firebase/app'

import { getBooks, perBookCount } from '../utils/functions'
import Book from '../utils/book'
import BookCell from '../components/BookCell'
import InfiniteScroll from 'react-infinite-scroller'
import SEO from '../components/SEO'
import EventContext from '../contexts/EventContext'
import { EventId } from '../utils/event'
import SectionHeader from '../components/SectionHeder'

interface InitialProps {
  books: Book[]
}

const Index: NextPage<InitialProps> = (props) => {
  const { books: initialBooks } = props
  const [hasMore, setHasMore] = useState(true)
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const { eventId } = useContext(EventContext)

  return (
    <div className="mt-8 mx-auto px-0 sm:px-4 max-w-3xl" >
      <SEO title="頒布物一覧" />
      <div className="relative mt-12">
        <SectionHeader en="BOOKS">頒布物一覧</SectionHeader>
      </div>
      <InfiniteScroll
        pageStart={0}
        loadMore={async () => {
          setHasMore(false)
          const lastBook = books[books.length - 1]
          const updatedAt = lastBook.updatedAt
          if (!updatedAt) return
          const nextBooks = await getBooks(eventId, {
            startAfter: new firebase.firestore.Timestamp(
              updatedAt.seconds,
              updatedAt.nanoseconds,
            ),
          })
          setBooks([...books, ...nextBooks])

          if (nextBooks.length == perBookCount) {
            setHasMore(true)
          }
        }}
        hasMore={hasMore}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }>
        {books.map((book: Book) => (
          <BookCell book={book} key={book.id} isShowCircle={true} />
        ))}
      </InfiniteScroll>
    </div>
  )
}

Index.getInitialProps = async ({ res, query }) => {
  if (res && res.setHeader) {
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=360, stale-while-revalidate',
    )
  }

  const eventId = query.eventId as EventId
  const books = await getBooks(eventId, {})
  return {
    books,
  }
}
export default Index
