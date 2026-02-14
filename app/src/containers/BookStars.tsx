/** @jsx jsx */
import { useContext } from 'react'

import { jsx, css } from '@emotion/react'
import { Container } from '../components/common/Container'
import BookCell from '../components/BookCell'
import withUser from '../withUser'
import useBook from '../hooks/useBook'
import EventContext from '../contexts/EventContext'
import StarsContext from '../contexts/StarsContext'
import StarTab from '../components/StarTab'

const AsnycBookCell = ({ bookId }: any) => {
  const { book } = useBook(bookId)
  return book ? <BookCell book={book} /> : null
}

const BookStars: React.FC = () => {
  const { eventId } = useContext(EventContext)
  const { userStars } = useContext(StarsContext)
  const bookStars = userStars[eventId].bookStars

  return (
    <>
      <StarTab />
      <Container
        className="my-8 mx-auto px-0 md:px-4"
        css={css`
          max-width: 720px;
        `}>
        {bookStars.map((bookId) => (
          <AsnycBookCell bookId={bookId} key={bookId} />
        ))}
        {bookStars.length === 0 && <p>チェックされた頒布物がありません。</p>}
      </Container>
    </>
  )
}

export default withUser(BookStars)
