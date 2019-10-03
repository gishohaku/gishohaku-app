/** @jsx jsx */
import { useContext, ComponentType } from 'react'
import UserContext from './contexts/UserContext'
import Loader from './components/Loader'
import MessageBox from './components/MessageBox'
import Link from 'next/link'
import { Button } from 'sancho'
import { jsx, css } from '@emotion/core'

const withUser = (WrappedComponent: ComponentType<any>) => (props: any) => {
  const { isUserLoading, user, userData } = useContext(UserContext)

  if (isUserLoading) {
    return <Loader />
  }

  if (!userData) {
    return <MessageBox
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

  }

  return <WrappedComponent user={user} userData={userData} {...props} />
}

export default withUser
