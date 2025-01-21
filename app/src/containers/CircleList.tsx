/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import { NextPage } from 'next'

import { Container } from '../components/common/Container'

import { getCircles } from '../utils/functions'
import Circle from '../utils/circle'
import CircleCell from '../components/CircleCell'
import { useContext } from 'react'
import StarsContext from '../contexts/StarsContext'
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
  gishohaku1: '/static/gishohaku1-layout.png',
  gishohaku2: '/static/gishohaku2-layout.png',
  gishohaku3: '',
  gishohaku4: '',
  gishohaku5: '/static/gishohaku5-layout.png',
  gishohaku6: '',
  gishohaku7: '/static/gishohaku7-layout.png',
  gishohaku8: '',
  gishohaku9: '/static/gishohaku9-layout.png',
  gishohaku10: '/static/gishohaku10-layout.png',
  gishohaku11: '/static/gishohaku11-layout.png',
}

const appealUrl: {
  [key in EventId]: string
} = {
  gishohaku1: '',
  gishohaku2: '',
  gishohaku3: '',
  gishohaku4: '',
  gishohaku5: '',
  gishohaku6: '',
  gishohaku7: '',
  gishohaku8: '',
  gishohaku9: 'https://docs.google.com/presentation/d/e/2PACX-1vSCzubLGp8DDN0Ucml88KC7EXun_Lg0L4V5q4f2flBDKv9kcDtsBdm3_pqGamlricHqSWWY4GXSYAzl/pub',
  gishohaku10: 'https://docs.google.com/presentation/d/e/2PACX-1vSjb-1y42NpyxyXiEF_shPELCZJ-7kNh2vm57mTNEulq8dfhx5GucpfSqbSHJR74Wbvrj7kcXTwV_yt/pub',
  gishohaku11: 'https://docs.google.com/presentation/d/e/2PACX-1vTH2hnc8lDFbLg6-dusd_ma2lLLUngJHOTXz2OOGDQNZMhcV-VrVEv8o6-X7yj19w7zuN1O5dv0n_Up/pub',
}

const Index: NextPage<InitialProps> = (props) => {
  const { circles } = props
  const { userStars, addStar, removeStar } = useContext(StarsContext)
  const { eventId } = useContext(EventContext)

  return (
    <Container
      css={css`
        max-width: ${1080 + 12 * 2}px;
        margin-top: px;
        padding: 0 !important;
      `}>
      <SEO title="サークル一覧" />
      <div
        css={css`
          position: relative;
          margin-top: 48px;
        `}>
        <SectionHeader en="CIRCLES">サークル一覧</SectionHeader>
        <div css={css`
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
        `}>
          <a
            target="_blank"
            rel="noopener"
            href={mapUrl[eventId]}
            css={css`
              background-color: #2a5773;
              border-radius: 4px;
              font-weight: bold;
              color: white;
              padding: 8px 24px;
              text-decoration: none;
              margin-right: 4px;
            `}>
            会場マップ
          </a>
          <a
            target="_blank"
            rel="noopener"
            href={appealUrl[eventId]}
            css={css`
              background-color: #2a5773;
              border-radius: 4px;
              font-weight: bold;
              color: white;
              padding: 8px 24px;
              text-decoration: none;
            `}>
            アピールスライド
          </a>
        </div>
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
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=360, stale-while-revalidate',
    )
  }

  const eventId = query.eventId as EventId
  const circles = await getCircles(eventId)
  return { circles }
}

export default Index

export const CirclesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 24px;
`
