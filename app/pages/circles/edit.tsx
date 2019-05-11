import firebase from 'firebase/app'
import 'firebase/firestore'

import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import router, { withRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import UserContext from '../../contexts/UserContext';
import CircleForm from '../../components/CircleForm';

type CricleCategory = 'software/frontend' | 'software/backend' | 'software/etc' | 'software/ml' | 'software/low-layer' | 'infra' | 'hardware' | 'etc'

interface Circle {
  id?: string
  name: string
  nameKana: string
  image: string
  category: CricleCategory
  // 通常サークル / 倍量サークル
  plan: 'normal' | 'premium'
}

const BooksNew = (props: any) => {
  const [circle, setCircle] = useState<Circle>()
  const { user, isUserLoading, userData } = useContext(UserContext)

  useEffect(() => {
    const id = props.router.query.id
    const db = firebase.firestore()
    db.collection("circles").doc(id).get()
      .then((docRef) => {
        console.log(docRef)
        setCircle({
          id: docRef.id,
          ...docRef.data() as Circle
        })
      })
  }, [props.router.query.id])

  if (isUserLoading || !user || !circle) {
    return <Layout><Loader /></Layout>
  }

  if (!isUserLoading && (!userData || !userData.circleRef)) {
    return <Layout><p>サークル専用ページです。</p></Layout>
  }

  return (
    <>
      <FormContainer>
        <CircleForm user={user} circle={circle} onSubmit={async (circle) => {
          const db = firebase.firestore()
          const id = props.router.query.id
          await db.collection("circles").doc(id).update(circle)
          router.push(`/mypage`)
        }} />
      </FormContainer>
    </>
  )
}

export default withRouter(BooksNew)
