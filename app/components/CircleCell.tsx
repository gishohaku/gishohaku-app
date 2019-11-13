/** @jsx jsx */
import Link from 'next/link'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'

import circleTumbnail from '../images/circle.png'

import Circle, { allCategories } from '../utils/circle'
import { colors, media } from '../utils/style'
import ImageBox from './ImageBox'
import CheckButton from './CheckButton'
import { useToast, IconChevronRight } from 'sancho'
import { useContext, useCallback } from 'react'
import UserContext from '../contexts/UserContext'
import { UserStars } from '../contexts/StarsContext'
import EventContext from '../contexts/EventContext'

interface Props {
  circle: Circle
  userStars: UserStars
  addStar: any
  removeStar: any
}

const width = 252

const CircleCell: React.FC<Props> = ({ circle, userStars, addStar, removeStar }) => {
  const { user, openLoginModal } = useContext(UserContext)
  const { eventId } = useContext(EventContext)
  const toast = useToast()

  const onCheckClick = useCallback(() => {
    if (!user) {
      return openLoginModal()
    }
    if (!circle.id) return
    if (userStars[eventId].circleStars.includes(circle.id)) {
      removeStar(eventId, 'circles', circle.id)
      toast({ title: `サークルのチェックを外しました` })
    } else {
      addStar(eventId, 'circles', circle.id)
      toast({ title: `サークルをチェックしました` })
    }
  }, [user, eventId, userStars])

  if (!circle.id) return null

  return (
    <Container>
      <Link href='/[eventId]/circles/[id]' as={`/${eventId}/circles/${circle.id}`} key={circle.id} passHref>
        <CircleLink>
          <CircleBooth>{circle.booth}</CircleBooth>
          <ImageBox size="circlecut" imageUrl={circle.image || circleTumbnail} />
          <CircleName>{circle.name}</CircleName>
          <CircleCategory>{allCategories[circle.category]}</CircleCategory>
        </CircleLink>
      </Link>
      <CheckButton
        isChecked={(circle.id && userStars[eventId].circleStars.includes(circle.id)) || false}
        onClick={onCheckClick}
      />
    </Container>
  )
}

export const CircleBooth: React.FC<{
  name?: string
}> = ({ children, name }) => <div css={css`
  display: flex;
  align-items: center;
`}>
  <div css={css`
    color: white;
    background-color: #2a5773;
    display: inline-block;
    font-size: 16px;
    font-weight: bold;
    padding: 4px 8px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    margin-right: 8px;
  `}>{children}</div>
  {name} {name && <IconChevronRight />}
</div>

export default CircleCell

const Container = styled.div`
  margin: 0 12px 32px;
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