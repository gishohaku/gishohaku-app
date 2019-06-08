/** @jsx jsx */
import firebase from 'firebase/app'
import 'firebase/firestore'
import { jsx, css } from '@emotion/core'

import BookForm from '../../components/BookForm'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import router, { withRouter } from 'next/router'
import { useEffect, useContext, useState } from 'react'
import Circle from '../../utils/circle'
import UserContext from '../../contexts/UserContext'

const BooksNew = (props: any) => {
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
            const db = firebase.firestore()
            await db.collection('books').add({
              ...book,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              circleRef: userData.circleRef,
              circleName: circle.name
            })
            props.router.push('/mypage/circle')
          }}
        />
      </FormContainer>
    </>
  )
}

const withUser = (Component: any) => {
  return (props: any) => {
    const { user } = useContext(UserContext)
    useEffect(() => {
      if (!user) {
        console.log('userNotFound')
        router.push('/books')
      }
    })
    return <Component {...props}>pppp</Component>
  }
}

export default withRouter(BooksNew)
// export default withUser(withRouter(BooksNew))
