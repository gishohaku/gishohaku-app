/** @jsx jsx */
import { jsx, css } from '@emotion/core'

import { Container } from 'sancho'
import { withRouter } from 'next/router'

import { getCircles } from '../../utils/functions'
import Circle from '../../utils/circle'
import CircleCell from '../../components/CircleCell'
import { useContext } from 'react'
import UserContext from '../../contexts/UserContext'

const Index = (props: any) => {
  const { circleStars, addCircleStar, removeCircleStar } = useContext(UserContext)

  return (
    <Container
      css={css`
        max-width: ${1080 + 12 * 2}px;
        margin-top: 32px;
        padding: 0 !important;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        `}
      >
        {props.circles.map((circle: Circle) => {
          return (
            <CircleCell
              circle={circle}
              key={circle.id}
              addCircleStar={addCircleStar}
              removeCircleStar={removeCircleStar}
              circleStars={circleStars}
            />
          )
        })}
      </div>
    </Container>
  )
}

Index.getInitialProps = async ({ res }: any) => {
  if (res && res.setHeader) {
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate')
  }

  const circles = await getCircles()
  return { circles }
}
export default withRouter(Index)
