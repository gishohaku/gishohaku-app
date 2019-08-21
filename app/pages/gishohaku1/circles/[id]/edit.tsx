import { NextPage } from 'next'

import firebase from 'firebase/app'
import 'firebase/firestore'

import { useState, useEffect, useContext } from 'react'
import router, { withRouter, NextRouter } from 'next/router'

import Loader from '../../../../components/Loader'
import FormContainer from '../../../../components/FormContainer'
import UserContext from '../../../../contexts/UserContext'
import CircleForm from '../../../../components/CircleForm'
import Circle from '../../../../utils/circle'

interface Props {
  router: NextRouter
}

const BooksNew: NextPage<Props> = props => {
  const [circle, setCircle] = useState<Circle>()
  const { user, isUserLoading, userData } = useContext(UserContext)

  useEffect(() => {
    const id = props.router.query.id as string
    const db: firebase.firestore.Firestore = firebase.firestore()
    db.collection('circles')
      .doc(id)
      .get()
      .then(docRef => {
        console.log(docRef)
        setCircle({
          id: docRef.id,
          ...(docRef.data() as Circle)
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
        <CircleForm
          user={user}
          circle={circle}
          onSubmit={async circle => {
            const db = firebase.firestore()
            const id = props.router.query.id as string
            await db
              .collection('circles')
              .doc(id)
              .update(circle)
            router.push(`/gishohaku1/mypage/circle`)
          }}
        />
      </FormContainer>
    </>
  )
}

export default withRouter(BooksNew)
