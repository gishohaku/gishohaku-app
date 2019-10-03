/** @jsx jsx */
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

import { jsx, css } from '@emotion/core'
import { Button, useToast } from 'sancho'
import { useRouter } from 'next/router'
import { useContext, useState, useEffect } from 'react'
import UserContext, { User } from '../../../contexts/UserContext'
import MessageBox from '../../../components/MessageBox'
import Loader from '../../../components/Loader'
import qs from 'qs'
import withUser from '../../../withUser'

const Join: React.FC = () => {
  const toast = useToast()
  const router = useRouter()
  const { reloadUser } = useContext(UserContext)
  const [isProcessing, setProcessing] = useState(false)
  const [circle, setCircle] = useState()

  // Static Site Exportではprops.router.queryが固定されており、自前でqueryを取得する必要がある
  // https://github.com/zeit/next.js/issues/4804
  const { circleId, token } = qs.parse(router.asPath.split('?')[1])
  console.log(circleId, token)

  useEffect(() => {
    const db: firebase.firestore.Firestore = firebase.firestore()
    if (!circleId || !token) { return }
    const circleRef = db.collection('circles').doc(circleId)
    circleRef.get().then(snapshot => {
      setCircle(snapshot.data())
    })
  }, [circleId])

  const handleClick = async () => {
    if (isProcessing) { return }
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
    router.push('/gishohaku1/mypage/circle')
  }

  if (!circleId || !token) {
    return <MessageBox title="無効なURLです。" description="URLを確認してください。" />
  }

  if (!circle) {
    return <Loader label="loading..." />
  }

  return (
    <MessageBox
      title="サークルに参加する"
      description={`「${circle.name}」から招待を受け取りました。`}
    >
      <Button
        loading={isProcessing}
        component="button"
        block
        css={css`
          margin-top: 12px;
        `}
        onPress={handleClick}
      >
        サークルに参加する
      </Button>
    </MessageBox>
  )
}

export default withUser(Join)
