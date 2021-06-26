import { useContext } from 'react'

import { Container } from '../components/common/Container'
import withUser from '../withUser'
import EventContext from '../contexts/EventContext'
import StarsContext from '../contexts/StarsContext'
import useCircle from '../hooks/useCircle'
import CircleCell from '../components/CircleCell'
import StarTab from '../components/StarTab'
import { CirclesList } from './CircleList'

const AsnycCircleCell = ({ circleId }: any) => {
  const { circle } = useCircle(circleId)
  const { userStars, addStar, removeStar } = useContext(StarsContext)
  return circle ? (
    <CircleCell
      circle={circle}
      userStars={userStars}
      addStar={addStar}
      removeStar={removeStar}
    />
  ) : null
}

const BookStars: React.FC = () => {
  const { eventId } = useContext(EventContext)
  const { userStars } = useContext(StarsContext)
  const circleStars = userStars[eventId].circleStars

  console.log(eventId, userStars, circleStars)

  return (
    <>
      <StarTab />
      <Container className="my-8 mx-auto px-0 md:px-4">
        <CirclesList>
          {circleStars.map((circleId) => (
            <AsnycCircleCell circleId={circleId} key={circleId} />
          ))}
          {circleStars.length === 0 && (
            <p>チェックしたサークルがありません。</p>
          )}
        </CirclesList>
      </Container>
    </>
  )
}

export default withUser(BookStars)
