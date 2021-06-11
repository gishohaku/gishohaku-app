/** @jsx jsx */
import { useContext } from 'react'

import { jsx, css } from '@emotion/core'
import { Container } from '../components/common/Container'
import BookCell from '../components/BookCell'
import { media } from '../utils/style'
import withUser from '../withUser'
import useBook from '../hooks/useBook'
import EventContext from '../contexts/EventContext'
import StarsContext from '../contexts/StarsContext'
import StarTab from '../components/StarTab'

const AsnycBookCell = ({ bookId }: any) => {
  const { book } = useBook(bookId)
  return book ? <BookCell isShowCircle={true} book={book} /> : null
}

const BookStars: React.FC = () => {
  const { eventId } = useContext(EventContext)
  const { userStars } = useContext(StarsContext)
  const bookStars = userStars[eventId].bookStars

  return (
    <>
      <StarTab />
      <Container
        css={css`
          max-width: 720px;
          margin: 32px auto;
          padding: 0 16px;
          @media ${media.small} {
            padding-left: 0;
            padding-right: 0;
          }
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
