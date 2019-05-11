/** @jsx jsx */
import firebase from 'firebase/app'
import 'firebase/firestore'
import { jsx, css } from '@emotion/core'

import BookForm from '../../components/BookForm'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import router, { withRouter } from 'next/router'
import { useEffect, useContext } from 'react';
import UserContext from '../../contexts/UserContext';

const BooksNew = (props: any) => {
  const { user, isUserLoading, userData } = useContext(UserContext)
  const circleRef = userData && userData.circleRef
  console.log(user, userData)

  if (isUserLoading || !user ) {
    return <Layout><Loader /></Layout>
  }

  if (!isUserLoading && (!userData || !userData.circleRef)) {
    return <Layout><p>サークル専用ページです。</p></Layout>
  }

  return (
    <FormContainer>
      <BookForm user={user} onSubmit={(book) => {
        const db = firebase.firestore()
        db.collection("books").add({
          ...book,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          circleRef,
        }).then((docRef) => {
          console.log(docRef)
          router.push('/books')
        })
      }} />
    </FormContainer>
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
    return <Component {...props}>
      pppp
    </Component>
  }
}

export default withRouter(BooksNew)
// export default withUser(withRouter(BooksNew))