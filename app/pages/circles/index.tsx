/** @jsx jsx */
import { jsx, css } from '@emotion/core'

import { Container, Button } from 'sancho'
import { withRouter } from 'next/router'

import { getCircles } from '../../utils/functions'
import Circle from '../../utils/circle'
import CircleCell from '../../components/CircleCell'
import { useContext, useState, useMemo } from 'react'
import UserContext from '../../contexts/UserContext'
import SectionHeader from '../../components/atoms/SectionHeader'

const Index = (props: any) => {
  const { circles, router } = props
  const { circleStars, addCircleStar, removeCircleStar } = useContext(UserContext)
  const [isCheckOnly, setCheckOnly] = useState(router.query.starred !== undefined)

  const filteredCircles = useMemo(() => {
    if (isCheckOnly) {
      return props.circles.filter((circle: Circle) => circleStars.includes(circle.id))
    }
    return circles
  }, [circles, isCheckOnly])

  return (
    <Container
      css={css`
        max-width: ${1080 + 12 * 2}px;
        margin-top: 48px;
        padding: 0 !important;
      `}
    >
      <SectionHeader text="CIRCLES" pageHeader>
        サークル一覧
      </SectionHeader>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 24px;
        `}
      >
        <Button
          onClick={() => {
            setCheckOnly(!isCheckOnly)
          }}
          intent={isCheckOnly ? 'primary' : undefined}
        >
          チェック済みのみ表示
        </Button>
      </div>
      <div
        css={css`
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 24px;
        `}
      >
        {filteredCircles.map((circle: Circle) => {
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
