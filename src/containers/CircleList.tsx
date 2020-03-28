/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import { NextPage } from 'next'

import { Container } from 'sancho'
import { withRouter } from 'next/router'

import { getCircles } from '../utils/functions'
import Circle from '../utils/circle'
import CircleCell from '../components/CircleCell'
import { useContext, useState, useMemo } from 'react'
import StarsContext from '../contexts/StarsContext'
import { WithRouterProps } from 'next/dist/client/with-router'
import SEO from '../components/SEO'
import EventContext from '../contexts/EventContext'
import { EventId } from '../utils/event'
import SectionHeader from '../components/SectionHeder'

interface InitialProps {
  circles: Circle[]
}

const mapUrl: {
  [key in EventId]: string
} = {
  gishohaku1: 'https://img.esa.io/uploads/production/attachments/13039/2019/11/14/4651/a27e64dc-082c-4d24-afa6-a0083664f885.png',
  gishohaku2: 'https://img.esa.io/uploads/production/attachments/13039/2019/11/21/44748/0c049717-3499-4bc1-9ed3-11772775f922.png'
}

const Index: NextPage<WithRouterProps & InitialProps, InitialProps> = props => {
  const { circles } = props
  const { userStars, addStar, removeStar } = useContext(StarsContext)
  const { eventId } = useContext(EventContext)

  return (
    <Container
      css={css`
        max-width: ${1080 + 12 * 2}px;
        margin-top: px;
        padding: 0 !important;
      `}
    >
      <SEO title="サークル一覧" />
      <div css={css`
        position: relative;
        margin-top: 48px;
      `}>
        <SectionHeader en="CIRCLES">サークル一覧</SectionHeader>
        <a
          target="_blank"
          rel="noopener"
          href={mapUrl[eventId]}
          css={css`
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background-color: #2a5773;
            border-radius: 4px;
            font-weight: bold;
            color: white;
            padding: 8px 24px;
            text-decoration: none;
          `}
        >
          会場マップ
        </a>
      </div>
      <CirclesList>
        {circles.map((circle: Circle) => {
          return (
            <CircleCell
              circle={circle}
              key={circle.id}
              userStars={userStars}
              addStar={addStar}
              removeStar={removeStar}
            />
          )
        })}
      </CirclesList>
    </Container>
  )
}

Index.getInitialProps = async ({ res, query }) => {
  if (res && res.setHeader) {
    res.setHeader('Cache-Control', 'public, s-maxage=360, stale-while-revalidate')
  }

  const eventId = query.eventId as EventId
  const circles = await getCircles(eventId)
  return { circles }
}
export default withRouter(Index)

export const CirclesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 24px;
`
