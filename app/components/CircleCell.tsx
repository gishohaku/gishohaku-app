/** @jsx jsx */
import Link from 'next/link'
import { jsx, css, Global } from '@emotion/core'

import { List, ListItem, IconChevronRight } from 'sancho'
import { withRouter } from 'next/router'

import circleTumbnail from '../images/circle.png'

import Circle, { categories } from '../utils/circle'
import { colors } from '../utils/style'
import ImageBox from './ImageBox'

interface Props {
  circle: Circle
}

const width = 252

const CircleCell: React.FC<Props> = ({ circle }) => {
  if (!circle.id) {
    return null
  }

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
          display: inline-block;
          max-width: ${width}px;
          width: 100%;
          margin: 0 12px 24px;
          color: inherit;
          &:hover h2 {
            color: ${colors.primary};
          }
        `}
      >
        <ImageBox size="circlecut" width={width} imageUrl={circle.image || circleTumbnail} />
        <h2
          css={css`
            font-size: 16px;
            font-weight: bold;
            margin-top: 2px;
          `}
        >
          {circle.name}
        </h2>
        <p
          css={css`
            font-size: 12px;
            opacity: 0.6;
          `}
        >
          {categories[circle.category]}
        </p>
      </a>
    </Link>
  )
}
export default withRouter(CircleCell)
