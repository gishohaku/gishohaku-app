/** @jsx jsx */
import firebase from 'firebase/app'
import 'firebase/firestore'
import { jsx, css } from '@emotion/core'

import BookForm from '../../components/BookForm'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import router, { withRouter } from 'next/router'
import { useEffect, useContext, useState } from 'react';
import UserContext from '../../contexts/UserContext';

const BooksNew = (props: any) => {
  const { user } = useContext(UserContext)
  const [circleRef, setCircleRef] = useState(null)
  useEffect(() => {
    if (!user) {
      setCircleRef(null)
    } else {
      const db = firebase.firestore()
      db.collection('users').doc(user.uid).get().then((doc) => {
        const userCircleRef = doc.data()!.circleRef
        setCircleRef(userCircleRef)
      })
    }
  }, [user])

  if (!user) {
    return <Loader />
  }

  return (
    <>
      <FormContainer>
        <BookForm user={user} onSubmit={async (book) => {
          const db = firebase.firestore()
          await db.collection("books").add({
            ...book,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            circleRef,
          })
          props.router.push('/mypage')
        }} />
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
    return <Component {...props}>
      pppp
    </Component>
  }
}

export default withRouter(BooksNew)
// export default withUser(withRouter(BooksNew))