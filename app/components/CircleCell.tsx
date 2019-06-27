/** @jsx jsx */
import Link from 'next/link'
import { jsx, css } from '@emotion/core'

import circleTumbnail from '../images/circle.png'

import Circle, { categories } from '../utils/circle'
import { colors, media } from '../utils/style'
import ImageBox from './ImageBox'
import CheckButton from './CheckButton'
import { useToast } from 'sancho'
import { useContext } from 'react'
import UserContext from '../contexts/UserContext'

interface Props {
  circle: Circle
  circleStars: string[]
  addCircleStar: any
  removeCircleStar: any
}

const width = 252

const CircleCell: React.FC<Props> = ({ circle, circleStars, addCircleStar, removeCircleStar }) => {
  const { user, openLoginModal } = useContext(UserContext)
  const toast = useToast()
  if (!circle.id) {
    return null
  }

  return (
    <div
      css={css`
        margin: 0 12px 24px;
        width: 252px;
        @media ${media.small} {
          width: 46%;
          margin: 0 1% 24px;
        }
      `}
    >
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
            margin-bottom: 4px;
            color: inherit;
            &:hover h2 {
              color: ${colors.primary};
            }
          `}
        >
          <ImageBox size="circlecut" imageUrl={circle.image || circleTumbnail} />
          <h2
            css={css`
              font-size: 16px;
              font-weight: bold;
              margin-top: 2px;
            `}
          >
            {circle.booth} {circle.name}
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
      <CheckButton
        isChecked={(circle.id && circleStars.includes(circle.id)) || false}
        onClick={() => {
          if (!user) {
            return openLoginModal()
          }
          if (!circle.id) {
            return
          }
          if (circleStars.includes(circle.id)) {
            removeCircleStar(circle.id)
            toast({
              title: `サークルのチェックを外しました`
            })
          } else {
            addCircleStar(circle.id)
            toast({
              title: `サークルをチェックしました`
            })
          }
        }}
      />
    </div>
  )
}
export default CircleCell
