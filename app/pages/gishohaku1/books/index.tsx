/** @jsx jsx */
import { useState } from 'react'
import { NextPage } from 'next'

import { jsx, css } from '@emotion/core'
import { getBooks, perBookCount } from '../../../utils/functions'

import Book from '../../../utils/book'
import BookCell from '../../../components/BookCell'
import { media } from '../../../utils/style'
import SectionHeader from '../../../components/atoms/SectionHeader'
import InfiniteScroll from 'react-infinite-scroller'

import firebase from 'firebase/app'
import SEO from '../../../components/SEO'

interface InitialProps {
  books: Book[]
}

const Index: NextPage<InitialProps> = props => {
  const { books: initialBooks } = props
  const [hasMore, setHasMore] = useState(true)
  const [books, setBooks] = useState<Book[]>(initialBooks)

  return (
    <div
      css={css`
        max-width: 720px;
        margin: 32px auto;
        padding: 0 16px;
        @media ${media.small} {
          padding-left: 0;
          padding-right: 0;
        }
      `}
    >
      <SEO title="頒布物一覧" />
      <SectionHeader text="BOOKS" pageHeader>
        頒布物一覧
      </SectionHeader>
      <InfiniteScroll
        pageStart={0}
        loadMore={async () => {
          setHasMore(false)
          const lastBook = books[books.length - 1]
          const updatedAt = lastBook.updatedAt
          const nextBooks = await getBooks({
            startAfter: new firebase.firestore.Timestamp(updatedAt!.seconds, updatedAt!.nanoseconds)
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
        }
      >
        {books.map((book: Book) => (
          <BookCell book={book} key={book.id} isShowCircle={true} />
        ))}
      </InfiniteScroll>
    </div>
  )
}

Index.getInitialProps = async ({ res }: any) => {
  if (res && res.setHeader) {
    res.setHeader('Cache-Control', 'public, s-maxage=360, stale-while-revalidate')
  }

  const books = await getBooks({})
  return {
    books
  }
}
export default Index
