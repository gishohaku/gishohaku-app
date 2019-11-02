/** @jsx jsx */
import Link from 'next/link'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'

import circleTumbnail from '../images/circle.png'

import Circle, { allCategories } from '../utils/circle'
import { colors, media } from '../utils/style'
import ImageBox from './ImageBox'
import CheckButton from './CheckButton'
import { useToast } from 'sancho'
import { useContext, useCallback } from 'react'
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

  const onCheckClick = useCallback(() => {
    if (!user) {
      return openLoginModal()
    }
    if (!circle.id) return
    if (circleStars.includes(circle.id)) {
      removeCircleStar(circle.id)
      toast({ title: `サークルのチェックを外しました` })
    } else {
      addCircleStar(circle.id)
      toast({ title: `サークルをチェックしました` })
    }
  }, [user, circle, circleStars])

  if (!circle.id) return null

  return (
    <Container>
      <Link href='/gishohaku1/circles/[id]' as={`/gishohaku1/circles/${circle.id}`} key={circle.id} passHref>
        <CircleLink>
          <ImageBox size="circlecut" imageUrl={circle.image || circleTumbnail} />
          <CircleName>{circle.booth} {circle.name}</CircleName>
          <CircleCategory>{allCategories[circle.category]}</CircleCategory>
        </CircleLink>
      </Link>
      <CheckButton
        isChecked={(circle.id && circleStars.includes(circle.id)) || false}
        onClick={onCheckClick}
      />
    </Container>
  )
}
export default CircleCell

const Container = styled.div`
  margin: 0 12px 24px;
  width: 252px;
  @media ${media.small} {
    width: 46%;
    margin: 0 1% 24px;
  }
`

const CircleLink = styled.a`
  text-decoration: none;
  display: inline-block;
  max-width: ${width}px;
  width: 100%;
  margin-bottom: 4px;
  color: inherit;
  &:hover h2 {
    color: ${colors.primary};
  }
`

const CircleName = styled.h2`
  font-size: 16px;
  font-weight: bold;
  margin-top: 2px;
`

const CircleCategory = styled.div`
  font-size: 12px;
  opacity: 0.6;
`