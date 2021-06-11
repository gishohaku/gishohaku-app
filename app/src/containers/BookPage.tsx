/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { db } from '../utils/firebase'
import Book, { refToId } from '../utils/book'
import SEO from '../components/SEO'
import { media } from '../utils/style'
import { NextPage } from 'next'
import BookCell from '../components/BookCell'

interface Props {
  book: Book
}

const BookPage: NextPage<Props> = (props) => {
  const { book } = props

  return (
    <>
      <div
        css={css`
          max-width: 720px;
          margin: 32px auto;
          padding: 0 16px;
          @media ${media.small} {
            padding-left: 0;
            padding-right: 0;
          }
        `}>
        <SEO
          title={book.title}
          description={book.description}
          imageUrl={book.images[0]}
        />
        <BookCell book={book} isShowCircle={true} isShowSnsShare={true} />
      </div>
    </>
  )
}

BookPage.getInitialProps = async ({ query }) => {
  const { id, eventId } = query

  //頒布情報を取得
  const bookDoc = db.collection('books').doc(id as string)
  const bookRef = await bookDoc.get()
  const bookData = bookRef.data() as Book
  const book = { id: bookRef.id, ...refToId(bookData) }

  return { book }
}

export default BookPage
