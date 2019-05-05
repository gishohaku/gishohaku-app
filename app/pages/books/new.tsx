import firebase from 'firebase/app'
import 'firebase/firestore'

import {
  Container,
} from 'sancho'
import Layout from '../../components/Layout'
import BookForm from '../../components/BookForm'
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

  return (
    <Layout tab={props.router.query.tab}>
      <Container>
        <BookForm onSubmit={(book) => {
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
      </Container>
    </Layout >
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