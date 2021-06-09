/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Button } from 'sancho'
import { useRouter } from 'next/router'
import { useContext, useState, useEffect } from 'react'
import UserContext from '../contexts/UserContext'
import MessageBox from '../components/MessageBox'
import Loader from '../components/Loader'
import qs from 'qs'
import withUser from '../withUser'
import EventContext from '../contexts/EventContext'
import { db, functions } from '../utils/firebase'
import Circle from '../utils/circle'
import { useToast } from '../components/Toast'

const Join: React.FC = () => {
  const { eventId } = useContext(EventContext)
  const toast = useToast()
  const router = useRouter()
  const { reloadUser } = useContext(UserContext)
  const [isProcessing, setProcessing] = useState(false)
  const [circle, setCircle] = useState<Circle>()

  // Static Site Exportではprops.router.queryが固定されており、自前でqueryを取得する必要がある
  // https://github.com/zeit/next.js/issues/4804
  const { circleId, token } = qs.parse(router.asPath.split('?')[1])
  console.log(circleId, token)

  useEffect(() => {
    if (!circleId) {
      return
    }
    if (!circleId || !token) {
      return
    }
    const circleRef = db.collection('circles').doc(circleId)
    circleRef.get().then((snapshot) => {
      setCircle(snapshot.data() as Circle)
    })
  }, [circleId])

  const handleClick = async () => {
    if (isProcessing) {
      return
    }
    setProcessing(true)
    const receiveInvitation = functions.httpsCallable('receiveInvitation')
    const result = await receiveInvitation({ circleId, token })
    // TODO: メッセージの表示
    console.log(result)
    toast({ title: 'サークルに参加しました' })
    await reloadUser()
    router.push('/[eventId]/mypage/circle', `/${eventId}/mypage/circle`)
  }

  if (!circleId || !token) {
    return (
      <MessageBox
        title="無効なURLです。"
        description="URLを確認してください。"
      />
    )
  }

  if (!circle) {
    return <Loader label="loading..." />
  }

  return (
    <MessageBox
      title="サークルに参加する"
      description={`「${circle.name}」から招待を受け取りました。`}>
      <Button
        loading={isProcessing}
        component="button"
        block
        css={css`
          margin-top: 12px;
        `}
        onPress={handleClick}>
        サークルに参加する
      </Button>
    </MessageBox>
  )
}

export default withUser(Join)
