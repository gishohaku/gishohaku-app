import { useState, useContext, useEffect } from 'react'
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
import Link from 'next/link'
import { IconShoppingCart, IconX } from 'sancho'
import { Portal } from '../components/Portal'
import { Embed } from '../components/common/Embed'

interface InitialProps {
  books: Book[]
}

const Index: NextPage<InitialProps> = (props) => {
  const { books: initialBooks } = props
  const [hasMore, setHasMore] = useState(true)
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const { eventId } = useContext(EventContext)
  const [active, setActive] = useState(-1)

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') setActive((prev) => Math.max(0, prev - 1))
      if (e.code === 'ArrowRight')
        setActive((prev) => Math.min(books.length - 1, prev + 1))
      if (e.code === 'Escape') setActive(-1)
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  return (
    <div className="mt-8 mx-auto px-0 sm:px-4 max-w-screen-lg">
      <SEO title="頒布物一覧" />
      <div className="relative mt-12">
        <SectionHeader en="BOOKS">頒布物一覧</SectionHeader>
        <Link href={`/${eventId}/mypage/book_stars`} passHref>
          <a className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gishohaku5 rounded font-bold text-white py-2 px-4">
            チェックリスト
          </a>
        </Link>
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
        <div className="flex flex-wrap mt-8">
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
          <Portal>
            <div
              className="fixed top-0 right-0 bottom-0 left-0 overflow-y-scroll"
              style={{ zIndex: 100 }}>
              <div className="my-8 sm:my-24 z-30 relative max-w-screen-md mx-auto pointer-events-none">
                {/* FIXME(mottox2): better pointer events */}
                <div className="pointer-events-auto inline-block mb-4">
                  <CircleLink book={books[active]} />
                </div>
                <div className="pointer-events-auto">
                  <BookCell book={books[active]} />
                </div>
              </div>
              <CloseButton onClick={() => setActive(-1)} />
              <div
                onClick={() => setActive(-1)}
                className="bg-black opacity-60 fixed top-0 right-0 bottom-0 left-0 z-20"
              />
            </div>
          </Portal>
        )}
      </InfiniteScroll>
    </div>
  )
}

const CloseButton: React.FC<{
  onClick(): void
}> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="close modal"
      className="fixed top-0 right-0 p-4 m-4 bg-white z-30 rounded-full shadow border border-gray-200">
      <IconX />
    </button>
  )
}

const CircleLink: React.FC<{
  book: Book
}> = ({ book }) => {
  const circle = book.circle
  if (!circle) return null
  return (
    <Link href={`/${book.eventId}/circles/${circle.id}`}>
      <a className={`bg-white inline-block p-3 rounded`}>
        <span className="bg-red-500 text-white px-2 py-1 font-bold text-sm rounded mr-2">
          {circle.booth}
        </span>
        {circle.name}
      </a>
    </Link>
  )
}

const BookItem: React.FC<{
  book: Book
  onClick(): void
}> = ({ book, onClick }) => {
  console.log(book)
  const { eventId, id } = book
  return (
    <a
      href={`/${eventId}/books/${id}`}
      className="w-1/2 sm:w-1/3 lg:w-1/4 inline-block px-2 mt-4"
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}>
      <div className="relative">
        <Embed width={300} height={420}>
          <img
            className="max-w-full"
            src={imageUrl(book.images[0], {
              aspect: 'pad',
              width: 300,
              height: 420,
            })}
          />
        </Embed>
        {book.purchaseUrl && (
          <a
            className="absolute bottom-0 right-0 p-2 m-2 bg-white rounded-full flex items-center justify-center shadow border border-gray-200"
            href={book.purchaseUrl}
            target="_blank"
            rel="noopener norefferer">
            <div className="relative left-[-1px]">
              <IconShoppingCart />
            </div>
          </a>
        )}
      </div>
      <p className="mt-2 mb-0.5 font-bold text-base leading-normal line-clamp-3">
        {book.title}
      </p>
      <p className="text-sm text-gray-500">{book.circle?.name}</p>
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
