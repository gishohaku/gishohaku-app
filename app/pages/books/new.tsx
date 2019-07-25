/** @jsx jsx */
import { useEffect, useContext, useState } from 'react'
import { withRouter } from 'next/router'

import firebase from 'firebase/app'
import 'firebase/firestore'
import { jsx } from '@emotion/core'

import BookForm from '../../components/BookForm'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import Circle from '../../utils/circle'
import UserContext from '../../contexts/UserContext'
import { NextPage } from 'next'

const BooksNew: NextPage<any> = props => {
  const { user, isUserLoading, userData } = useContext(UserContext)
  const [circle, setCircle] = useState<Circle | null>(null)
  useEffect(() => {
    if (!userData || !userData.circleRef) {
      setCircle(null)
    } else {
      userData.circleRef.get().then(snapshot => {
        setCircle(snapshot.data() as Circle)
      })
    }
  }, [userData])

  if (isUserLoading || !user || !userData || !circle) {
    return <Loader />
  }

  return (
    <>
      <FormContainer>
        <BookForm
          user={user}
          onSubmit={async book => {
            const db: firebase.firestore.Firestore = firebase.firestore()
            const bookSnapshots = await db
              .collection('books')
              .where('circleRef', '==', userData.circleRef)
              .get()
            await db.collection('books').add({
              ...book,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              circleRef: userData.circleRef,
              circleName: circle.name,
              circleBooth: circle.booth,
              order: bookSnapshots.size
            })
            props.router.push('/mypage/circle')
          }}
        />
      </FormContainer>
    </>
  )
}

export default withRouter(BooksNew)
