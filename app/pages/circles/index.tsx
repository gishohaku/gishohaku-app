/** @jsx jsx */
import Link from 'next/link'
import { jsx, css, Global } from '@emotion/core'

import { Container, List, ListItem, IconChevronRight } from 'sancho'
import { withRouter } from 'next/router'

import circleTumbnail from '../../images/circle.png'

import { getCircles } from '../../utils/functions'
import Circle, { categories } from '../../utils/circle'
import ImageBox from '../../components/ImageBox'
import CircleCell from '../../components/CircleCell'

// TODO: ちゃんと作る
const Index = (props: any) => {
  return (
    <Container
      css={css`
        max-width: ${1080 + 12 * 2}px;
        margin-top: 32px;
        padding: 0 !important;
      `}
    >
      <Global
        styles={{
          body: {
            backgroundColor: '#F7F8FA'
          }
        }}
      />
      <div
        css={css`
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        `}
      >
        {props.circles.map((circle: Circle) => {
          return <CircleCell circle={circle} key={circle.id} />
          return (
            <Link
              href={`/circles/_id?id=${circle.id}`}
              as={`/circles/${circle.id}`}
              key={circle.id}
              passHref
            >
              <a
                css={css`
                  text-decoration: none;
                `}
              >
                <ListItem
                  contentBefore={
                    <ImageBox
                      size="circlecut"
                      width={80}
                      imageUrl={circle.image || circleTumbnail}
                    />
                  }
                  primary={circle.name}
                  secondary={[circle.space, categories[circle.category]].filter(o => o).join(' | ')}
                  contentAfter={<IconChevronRight />}
                />
              </a>
            </Link>
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
