/** @jsx jsx */
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

import Link from 'next/link'
import { jsx, css } from '@emotion/core'
import { Spinner, Button, useToast } from 'sancho'
import { withRouter } from 'next/router'
import { useContext, useState, useEffect, useCallback } from 'react'
import UserContext from '../../contexts/UserContext';
import MessageBox from '../../components/MessageBox';
import Loader from '../../components/Loader';
import router from 'next/router'
import qs from 'qs'

// FIXME: 影響範囲が大きく汚い
export const INVITE_STORAGE_KEY = 'INVITE_STORAGE_KEY'

const Join: React.FC<{
  router: any
}> = (props) => {
  const toast = useToast()
  const { user, isUserLoading, userData, reloadUser } = useContext(UserContext)
  const [isProcessing, setProcessing] = useState(false)

  // Static Site Exportではprops.router.queryが固定されており、自前でqueryを取得する必要がある
  // https://github.com/zeit/next.js/issues/4804
  const { circleId, token } = qs.parse(props.router.asPath.split('?')[1])
  console.log(circleId, token)

  const handleClick = async () => {
    if (isProcessing) {
      return
    }
    setProcessing(true)
    const receiveInvitation = firebase.functions().httpsCallable('receiveInvitation')
    const result = await receiveInvitation({ circleId, token })
    // TODO: メッセージの表示
    console.log(result)
    await reloadUser()
    toast({
      title: 'サークルに参加しました',
      intent: 'success'
    })
    props.router.push('/mypage')
  }

  if (!circleId || !token) {
    return <MessageBox
      title="無効なURLです。"
      description="URLを確認してください。"
    />
  }

  if (isUserLoading || (user && !userData)) {
    return <Loader label="loading..." />
  }

  if (!user) {
    return <MessageBox
      title="ログインが必要です。"
      description="このページを利用するにはログインが必要です。"
    >
      <Link href="/sign_in" passHref>
        <Button component="a" block css={css`
          margin-top: 12px;
          `}
          onClick={() => {
            localStorage.setItem(INVITE_STORAGE_KEY, props.router.asPath)
          }}
        >
          ログイン
          </Button>
      </Link>
    </MessageBox>
  }

  return <MessageBox
    title="サークルへの参加する"
    description="招待を受け取りました。サークルへ参加できます。"
  >
    <Button loading={isProcessing} component="button" block css={css`
        margin-top: 12px;
      `}
      onPress={handleClick}
    >
      サークルに参加する
      </Button>
  </MessageBox>
}

export default withRouter(Join)
