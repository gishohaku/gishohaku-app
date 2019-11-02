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
import { User } from '../../../contexts/UserContext'
import { NextPage } from 'next'
import withUser from '../../../withUser'
import EventContext from '../../../contexts/EventContext'

const BooksNew: NextPage<{
  user: firebase.User
  userData: User
}> = ({ user, userData }) => {
  const router = useRouter()
  const { eventId } = useContext(EventContext)
  const [circle, setCircle] = useState<Circle>()
  const circleRef = userData.event && userData.event[eventId]

  useEffect(() => {
    if (!circleRef) { return }
    circleRef.get().then(snapshot => {
      setCircle(snapshot.data() as Circle)
    })
  }, [userData])

  if (!circleRef) { return <p>権限ないっす</p> }

  if (!circle) { return <Loader /> }

  return (
    <>
      <FormContainer>
        <BookForm
          user={user}
          onSubmit={async book => {
            const db: firebase.firestore.Firestore = firebase.firestore()
            const query = db.collection('books').where('circle.ref', '==', circleRef)
            const bookSnapshots = await query.get()
            await db.collection('books').add({
              ...book,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              circle: {
                ref: circleRef,
                name: circle.name,
                booth: circle.booth
              },
              circleRef: circleRef,
              order: bookSnapshots.size,
              eventId
            })
            router.push(`/${eventId}/mypage/circle`)
          }}
        />
      </FormContainer>
    </>
  )
}

export default withUser(BooksNew)
