/** @jsx jsx */
import Link from 'next/link'

import { jsx, css } from '@emotion/core'

import { Button, List, ListItem, Divider, Container, IconChevronRight } from 'sancho'
import { withRouter } from 'next/router'
import { useContext } from 'react'
import UserContext from '../contexts/UserContext'
import MessageBox from '../components/MessageBox'
import Loader from '../components/Loader'

const Mypage: React.FC = () => {
  const { user, isUserLoading, userData } = useContext(UserContext)

  if (isUserLoading) {
    return <Loader label="Loading..." />
  }

  if (!user) {
    return (
      <MessageBox
        title="ログインが必要です。"
        description="このページを利用するにはログインが必要です。"
      >
        <Link href="/sign_in" passHref>
          <Button
            component="a"
            css={css`
              margin-top: 12px;
              width: 100%;
            `}
          >
            ログイン
          </Button>
        </Link>
      </MessageBox>
    )
  }

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
      />
    </Container>
  )
}

export default withRouter(Mypage)
