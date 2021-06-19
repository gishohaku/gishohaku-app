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
import { imageUrl } from '../utils/imageUrl'

interface InitialProps {
  books: Book[]
}

const Index: NextPage<InitialProps> = (props) => {
  const { books: initialBooks } = props
  const [hasMore, setHasMore] = useState(true)
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const { eventId } = useContext(EventContext)
  const [active, setActive] = useState(-1)

  return (
    <div className="mt-8 mx-auto px-0 sm:px-4 max-w-screen-lg">
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
        <div className="flex flex-wrap">
          {books.map((book: Book, i: number) => {
            return (
              <BookItem
                key={book.id}
                book={book}
                onClick={() => {
                  setActive(i)
                }}
              />
            )
          })}
        </div>
        {active > -1 && (
          <div className="fixed top-0 right-0 bottom-0 left-0 overflow-y-scroll">
            <div className="mx-12 my-24 z-30 relative">
              <BookCell book={books[active]} />
            </div>
            <div onClick={() => setActive(-1)} className="bg-black opacity-60 fixed top-0 right-0 bottom-0 left-0 z-20"/>
          </div>
        )}
      </InfiniteScroll>
    </div>
  )
}

const BookItem: React.FC<{
  book: Book
  onClick(): void
}> = ({ book, onClick }) => {
  console.log(book)
  const {eventId, id} = book
  return (
    <a href={`/${eventId}/books/${id}`} className="w-1/3 lg:w-1/4 inline-block mb-4" onClick={(e) => {
      e.preventDefault()
      onClick()
    }}>
      <img
        className="max-w-full"
        src={imageUrl(book.images[0], {
          aspect: 'pad',
          width: 300,
          height: 480,
        })}
      />
      <p className="mt-1 font-bold text-base leading-normal">{book.title}</p>
      <p className="text-sm">{book.circle?.name}</p>
    </a>
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
