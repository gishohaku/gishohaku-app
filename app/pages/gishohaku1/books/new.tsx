/** @jsx jsx */
import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'

import firebase from 'firebase/app'
import 'firebase/firestore'
import { jsx } from '@emotion/core'

import BookForm from '../../../components/BookForm'
import Loader from '../../../components/Loader'
import FormContainer from '../../../components/FormContainer'
import Circle from '../../../utils/circle'
import UserContext, { User } from '../../../contexts/UserContext'
import { NextPage } from 'next'
import withUser from '../../../withUser'

const BooksNew: NextPage<{
  user: firebase.User
  userData: User
}> = ({ user, userData }) => {
  const router = useRouter()
  const [circle, setCircle] = useState<Circle>()
  useEffect(() => {
    const { circleRef } = userData
    if (!circleRef) { return }
    circleRef.get().then(snapshot => {
      setCircle(snapshot.data() as Circle)
    })
  }, [userData])

  if (!circle) { return <Loader /> }

  return (
    <>
      <FormContainer>
        <BookForm
          user={user}
          onSubmit={async book => {
            const db: firebase.firestore.Firestore = firebase.firestore()
            const query = db.collection('books').where('circleRef', '==', userData.circleRef)
            const bookSnapshots = await query.get()
            await db.collection('books').add({
              ...book,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              circleRef: userData.circleRef,
              circleName: circle.name,
              circleBooth: circle.booth,
              order: bookSnapshots.size,
              circle: {
                ref: userData.circleRef
              },
              eventId: 'gishohaku1'
            })
            router.push('/gishohaku1/mypage/circle')
          }}
        />
      </FormContainer>
    </>
  )
}

export default withUser(BooksNew)
