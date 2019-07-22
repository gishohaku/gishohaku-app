/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { NextPage } from 'next'

import { Container, Button } from 'sancho'
import { withRouter } from 'next/router'

import { getCircles } from '../../utils/functions'
import Circle from '../../utils/circle'
import CircleCell from '../../components/CircleCell'
import { useContext, useState, useMemo } from 'react'
import UserContext from '../../contexts/UserContext'
import SectionHeader from '../../components/atoms/SectionHeader'
import { initFirebase } from '../../utils/firebase'
import { WithRouterProps } from 'next/dist/client/with-router'
import SEO from '../../components/SEO'

interface InitialProps {
  circles: Circle[]
}

const Index: NextPage<WithRouterProps & InitialProps, InitialProps> = props => {
  const { circles, router } = props
  const { circleStars, addCircleStar, removeCircleStar } = useContext(UserContext)
  const [isCheckOnly, setCheckOnly] = useState(router.query.starred !== undefined)

  const filteredCircles = useMemo(() => {
    if (isCheckOnly) {
      return props.circles.filter(circle => circle.id && circleStars.includes(circle.id))
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
      <SEO title="サークル一覧" />
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
          {(() => {
            if (isCheckOnly) {
              return (
                <div>
                  <span
                    className="material-icons"
                    css={css`
                      vertical-align: middle;
                      margin-right: 4px;
                      font-size: 20px;
                    `}
                  >
                    filter_list
                  </span>
                  <span
                    css={css`
                      vertical-align: middle;
                    `}
                  >
                    チェック済みのみ表示中
                  </span>
                </div>
              )
            }
            return (
              <div>
                <span
                  className="material-icons"
                  css={css`
                    vertical-align: middle;
                    margin-right: 4px;
                    font-size: 20px;
                  `}
                >
                  check_circle
                </span>
                <span
                  css={css`
                    vertical-align: middle;
                  `}
                >
                  チェック済みのみ表示
                </span>
              </div>
            )
          })()}
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

Index.getInitialProps = async ({ res }) => {
  if (res && res.setHeader) {
    res.setHeader('Cache-Control', 'public, s-maxage=360, stale-while-revalidate')
  }

  initFirebase()
  const circles = await getCircles()
  return { circles }
}
export default withRouter(Index)
