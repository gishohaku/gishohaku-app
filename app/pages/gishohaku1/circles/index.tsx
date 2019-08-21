/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { NextPage } from 'next'

import { Container, Button, IconMap } from 'sancho'
import { withRouter } from 'next/router'

import { getCircles } from '../../../utils/functions'
import Circle from '../../../utils/circle'
import CircleCell from '../../../components/CircleCell'
import { useContext, useState, useMemo } from 'react'
import UserContext from '../../../contexts/UserContext'
import { initFirebase } from '../../../utils/firebase'
import { WithRouterProps } from 'next/dist/client/with-router'
import SEO from '../../../components/SEO'
import Lightbox from 'react-image-lightbox';
import CircleSelect from '../../../components/CircleSelect';

interface InitialProps {
  circles: Circle[]
}

const Index: NextPage<WithRouterProps & InitialProps, InitialProps> = props => {
  const { circles, router } = props
  const { circleStars, addCircleStar, removeCircleStar } = useContext(UserContext)
  const [isCheckOnly] = useState(router.query.starred !== undefined)
  const [isOpenMap, setOpenMap] = useState(false)

  const filteredCircles = useMemo(() => {
    if (isCheckOnly) {
      return props.circles.filter(circle => circle.id && circleStars.includes(circle.id))
    }
    return circles
  }, [circles, isCheckOnly])

  return (
    <>
      <CircleSelect circleId="" starIds={circleStars} router={router} />
      <Container
        css={css`
        max-width: ${1080 + 12 * 2}px;
        margin-top: px;
        padding: 0 !important;
      `}
      >
        <SEO title="サークル一覧" />
        <div
          css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 24px;
        `}
        >
          <Button iconBefore={<IconMap />} css={css`
          margin-left: 8px;
        `} onClick={() => {
              setOpenMap(true)
            }}>
            会場マップ
        </Button>
          {isOpenMap && <Lightbox
            mainSrc="/static/map.png"
            onCloseRequest={() => setOpenMap(false)}
          />}
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
    </>
  )
}

Index.getInitialProps = async ({ res }) => {
  if (res && res.setHeader) {
    res.setHeader('Cache-Control', 'public, s-maxage=360, stale-while-revalidate')
  }

  initFirebase()
  const circles = await getCircles()
  return { circles }
}
export default withRouter(Index)
