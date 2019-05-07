import firebase from 'firebase/app'
import 'firebase/firestore'

import {
  Container, Spinner
} from 'sancho'
import Layout from '../../components/Layout'
import BookForm from '../../components/BookForm'
import FormContainer from '../../components/FormContainer'
import router, { withRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import { Book } from '../../utils/firebase'
import UserContext from '../../contexts/UserContext';

const BooksNew = (props: any) => {
  const [book, setBook] = useState()
  const { user } = useContext(UserContext)

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

  if (!user) {
    return <Spinner />
  }

  return (
    <Layout tab={props.router.query.tab}>
      <FormContainer>
        {book &&
          <BookForm user={user} book={book} onSubmit={(book) => {
            const db = firebase.firestore()
            const id = props.router.query.id
            db.collection("books").doc(id).update(book).then((docRef) => {
              const id = props.router.query.id
              router.push(`/books/_id?id=${id}`, `/books/${id}`)
            })
          }} />
        }
      </FormContainer>
    </Layout >
  )
}

export default withRouter(BooksNew)
