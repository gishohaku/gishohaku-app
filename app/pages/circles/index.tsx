/** @jsx jsx */
import Link from 'next/link'
import { jsx, css, Global } from '@emotion/core'

import { Container, List, ListItem, IconChevronRight } from 'sancho'
import { withRouter } from 'next/router'

import circleTumbnail from '../../images/circle.png'

import { getCircles } from '../../utils/functions'
import Circle, { categories } from '../../utils/circle'
import ImageBox from '../../components/ImageBox'

// TODO: ちゃんと作る
const Index = (props: any) => {
  return (
    <Container css={css`
      max-width: 720px;
      margin-top: 32px;
    `}>
      <Global styles={{
        body: {
          backgroundColor: "#F7F8FA"
        }
      }} />
      <List>
        {props.circles.map((circle: Circle) => {
          return <Link href={`/circles/_id?id=${circle.id}`} as={`/circles/${circle.id}`} key={circle.id} passHref>
            <a css={css`
              text-decoration: none;
            `}>
              <ListItem
                contentBefore={<ImageBox size='circlecut' width={80} imageUrl={circle.image || circleTumbnail} />}
                primary={circle.name}
                secondary={[circle.space, categories[circle.category]].filter(o => o).join(' | ')}
                contentAfter={<IconChevronRight />}
              />
            </a>
          </Link>
        })}
      </List>
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
