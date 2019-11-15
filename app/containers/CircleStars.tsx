/** @jsx jsx */
import { useContext } from 'react'

import { jsx, css } from '@emotion/core'
import { Container } from 'sancho'
import { media } from '../utils/style'
import withUser from '../withUser'
import EventContext from '../contexts/EventContext'
import StarsContext from '../contexts/StarsContext'
import useCircle from '../hooks/useCircle'
import CircleCell from '../components/CircleCell'
import StarTab from '../components/StarTab'

const AsnycBookCell = ({ circleId }: any) => {
  const { circle } = useCircle(circleId)
  const { userStars, addStar, removeStar } = useContext(StarsContext)
  return circle
    ? <CircleCell circle={circle} userStars={userStars} addStar={addStar} removeStar={removeStar} />
    : null
}

const BookStars: React.FC = () => {
  const { eventId } = useContext(EventContext)
  const { userStars } = useContext(StarsContext)
  const circleStars = userStars[eventId].circleStars

  console.log(eventId, userStars, circleStars)

  return (
    <>
      <StarTab />
      <Container
        css={css`
        margin: 32px auto;
        padding: 0 16px;
        @media ${media.small} {
          padding-left: 0;
          padding-right: 0;
        }
      `}
      >
        {circleStars.map(circleId => (
          <AsnycBookCell circleId={circleId} key={circleId} />
        ))}
        {
          circleStars.length === 0 && <p>チェックしたサークルがありません。</p>
        }
      </Container>
    </>
  )
}

export default withUser(BookStars)
