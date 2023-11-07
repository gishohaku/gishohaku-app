import { useContext } from 'react'
import Link from 'next/link'
import { Container, IconChevronRight, List, ListItem, IconLogOut } from 'sancho'

import { firebase } from '../utils/firebase'
import withUser from '../withUser'
import EventContext from '../contexts/EventContext'
import { User } from '../contexts/UserContext'

interface Props {
  user: firebase.User
  userData: User
}

const Mypage: React.FC<Props> = ({ userData }) => {
  const { eventId } = useContext(EventContext)
  const circleRef = userData.event && userData.event[eventId]

  return (
    <Container>
      <div className="mt-4">
        {userData.displayName}さん ({userData.uid})
      </div>

      <div className="bg-white mt-8 overflow-hidden rounded shadow">
        <List>
          <Link href={`/${eventId}/mypage/circle_stars`} passHref>
            <a>
              <ListItem
                primary="チェックしたサークル"
                secondary="チェックをつけたサークルを確認できます"
                contentAfter={<IconChevronRight />}
              />
            </a>
          </Link>
          <Link href={`/${eventId}/mypage/book_stars`} passHref>
            <a>
              <ListItem
                primary="チェックした頒布物"
                secondary="チェックをつけた頒布物が確認できます"
                contentAfter={<IconChevronRight />}
              />
            </a>
          </Link>
          {circleRef && (
            <Link href={`/${eventId}/mypage/circle`} passHref>
              <a>
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

      <List className="mt-4">
        <ListItem
          primary="ログアウト"
          contentBefore={<IconLogOut />}
          contentAfter={<IconChevronRight />}
          onClick={async () => {
            const auth: firebase.auth.Auth = firebase.auth()
            await auth.signOut()
            // TODO: auth.onAuthStateChangedのハンドリングをちゃんとやる
            location.href = '/'
            // await router.push('/gishohaku1')
          }}
        />
      </List>
    </Container>
  )
}

export default withUser(Mypage)
