/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import { colors } from '../utils/style'
import Link from 'next/link'
import { useContext } from 'react'
import EventContext from '../contexts/EventContext'
import { useRouter } from 'next/router'

const Item = styled.div<{
  isActive?: boolean
}>`
  border-bottom: 2px solid ${props => props.isActive ? colors.primary : 'transparent'};
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: ${props => props.isActive ? colors.primary : '#787878'};
  &:hover {
    background-color: #fafafa;
  }
`

export default () => {
  const { eventId } = useContext(EventContext)
  const { pathname } = useRouter()
  return <div css={css`
    margin: 0 auto;
    background-color: white;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: center;
  `}>
    <Link href="/[eventId]/mypage/circle_stars" as={`/${eventId}/mypage/circle_stars`}>
      <Item isActive={pathname === "/[eventId]/mypage/circle_stars"}>チェックしたサークル</Item>
    </Link>
    <Link href="/[eventId]/mypage/book_stars" as={`/${eventId}/mypage/book_stars`}>
      <Item isActive={pathname === "/[eventId]/mypage/book_stars"}>チェックした頒布物</Item>
    </Link>
  </div>
}