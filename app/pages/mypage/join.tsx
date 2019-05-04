import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

import { Spinner, Button } from 'sancho'
import Layout from '../../components/layout'
import { withRouter } from 'next/router'
import { useContext, useState } from 'react'
import UserContext from '../../contexts/UserContext';

const Join = (props: any) => {
  const { user, isUserLoading } = useContext(UserContext)
  const [isProcessing, setProcessing] = useState(false)
  const { circleId, token } = props.router.query

  const handleClick = async () => {
    setProcessing(true)
    const receiveInvitation = firebase.functions().httpsCallable('receiveInvitation')
    const result = await receiveInvitation({ circleId, token })
    // TODO: メッセージの表示
    console.log(result)
    setProcessing(false)
  }

  if (isUserLoading) {
    return <Spinner label="Loading..." center />
  }

  if (!user) {
    return <Layout><p>サークルへの参加にはログインしてください</p></Layout>
  }

  if (!circleId || !token) {
    return <Layout><p>無効な招待URLです</p></Layout>
  }

  return (
    <Layout tab={props.router.query.tab}>
      <Button loading={isProcessing} onClick={handleClick}>サークルに参加する</Button>
    </Layout >
  )
}

export default withRouter(Join)
