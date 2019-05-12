import firebase from 'firebase/app'
import 'firebase/firestore'

import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import router, { withRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import UserContext from '../../contexts/UserContext';
import CircleForm from '../../components/CircleForm';
import Circle from '../../utils/circle'

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
    return <Loader />
  }

  if (!isUserLoading && (!userData || !userData.circleRef)) {
    return <p>サークル専用ページです。</p>
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
