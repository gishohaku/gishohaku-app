/** @jsx jsx */
import Link from 'next/link'
import { useRouter } from 'next/router'
import firebase from 'firebase/app'

import { jsx, css } from '@emotion/core'

import { Container, IconChevronRight, List, ListItem, IconLogOut } from 'sancho'
import withUser from '../withUser'
import EventContext from '../contexts/EventContext'
import { useContext } from 'react'
import { User } from '../contexts/UserContext'

interface Props {
  user: firebase.User
  userData: User
}

const noDecoration = css`
  text-decoration: none;
`

const Mypage: React.FC<Props> = ({ userData }) => {
  const router = useRouter()
  const { eventId } = useContext(EventContext)
  const circleRef = userData.event && userData.event[eventId]

  return (
    <Container>
      <div
        css={css`
          background-color: white;
          margin-top: 20px;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
        `}
      >
        <List>
          {eventId === 'gishohaku1' && <>
            <Link href='/[eventId]/circles?starred' as={`/${eventId}/circles?starred`} passHref>
              <a css={noDecoration}>
                <ListItem
                  primary="チェックしたサークル"
                  secondary="チェックをつけたサークルを確認できます"
                  contentAfter={<IconChevronRight />}
                />
              </a>
            </Link>
            <Link href='/[eventId]/mypage/book_stars`' as={`/${eventId}/mypage/book_stars`} passHref>
              <a css={noDecoration}>
                <ListItem
                  primary="チェックした頒布物"
                  secondary="チェックをつけた頒布物が確認できます"
                  contentAfter={<IconChevronRight />}
                />
              </a>
            </Link>
          </>
          }
          {circleRef && (
            <Link href='/[eventId]/mypage/circle' as={`/${eventId}/mypage/circle`} passHref>
              <a css={noDecoration}>
                <ListItem
                  primary="サークル情報編集"
                  secondary="サークル情報の編集、頒布物の登録、見本誌の提出、チェック数の確認を行えます"
                  contentAfter={<IconChevronRight />}
                />
              </a>
            </Link>
          )}
        </List>
      </div>

      <List
        css={css`
          margin-top: 20px;
        `}
      >
        <ListItem
          primary="ログアウト"
          contentBefore={<IconLogOut />}
          contentAfter={<IconChevronRight />}
          onClick={async () => {
            const auth: firebase.auth.Auth = firebase.auth()
            await router.push('/gishohaku1')
            auth.signOut()
          }}
        />
      </List>
    </Container>
  )
}

export default withUser(Mypage)
