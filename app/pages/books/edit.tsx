import firebase from 'firebase/app'
import 'firebase/firestore'

import BookForm from '../../components/BookForm'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import router, { withRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import Book from '../../utils/book'
import UserContext from '../../contexts/UserContext';

const BooksNew = (props: any) => {
  const [book, setBook] = useState()
  const { user, isUserLoading, userData } = useContext(UserContext)

  useEffect(() => {
    const id = props.router.query.id
    const db = firebase.firestore()
    db.collection("books").doc(id).get()
      .then((docRef) => {
        console.log(docRef)
        setBook({
          id: docRef.id,
          ...docRef.data() as Book
        })
      })
  }, [props.router.query.id])

  if (isUserLoading || !user || !book) {
    return <Layout><Loader /></Layout>
  }

  if (!isUserLoading && (!userData || !userData.circleRef)) {
    return <Layout><p>サークル専用ページです。</p></Layout>
  }

  return (
    <FormContainer>
      <BookForm user={user} book={book} onSubmit={(book) => {
        const db = firebase.firestore()
        const id = props.router.query.id
        db.collection("books").doc(id).update(book).then((docRef) => {
          const id = props.router.query.id
          router.push('/mypage')
        })
      }} />
    </FormContainer>
  )
}

export default withRouter(BooksNew)
