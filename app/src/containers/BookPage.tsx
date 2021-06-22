import { db } from '../utils/firebase'
import Book, { refToId } from '../utils/book'
import SEO from '../components/SEO'
import { NextPage } from 'next'
import BookCell from '../components/BookCell'
import SnsShare, { SnsShareSize } from '../components/SnsShare'

interface Props {
  book: Book
}

const BookPage: NextPage<Props> = (props) => {
  const { book } = props

  return (
    <div className="mt-8 mx-auto px-0 sm:px-4 max-w-3xl">
      <SEO
        title={book.title}
        description={book.description}
        imageUrl={book.images[0]}
      />
      <div className="text-right mb-8">
        <SnsShare size={SnsShareSize.Large} />
      </div>
      <BookCell book={book} />
    </div>
  )
}

BookPage.getInitialProps = async ({ query }) => {
  const { id } = query

  //頒布情報を取得
  const bookDoc = db.collection('books').doc(id as string)
  const bookRef = await bookDoc.get()
  const bookData = bookRef.data() as Book
  const book = { id: bookRef.id, ...refToId(bookData) }

  return { book }
}

export default BookPage
