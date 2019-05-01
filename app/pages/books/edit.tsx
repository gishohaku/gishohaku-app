import firebase from 'firebase/app'
import 'firebase/firestore'

import {
  Container,
} from 'sancho'
import Layout from '../../components/layout'
import BookForm from '../../components/BookForm'
import router, { withRouter } from 'next/router'
import { useState, useEffect } from 'react'

interface Book {
  id: string
  title: string
}

const BooksNew = (props: any) => {
  const [book, setBook] = useState()

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

  return (
    <Layout tab={props.router.query.tab}>
      <Container>
        {book &&
          <BookForm book={book} onSubmit={(event, book) => {
            const db = firebase.firestore()
            const id = props.router.query.id
            db.collection("books").doc(id).update(book).then((docRef) => {
              console.log(docRef)
              // debugger
              router.push(`/books/book?id=${props.router.query.id}`)
            })
            event.preventDefault()
          }} />
        }
      </Container>
    </Layout >
  )
}

// BooksNew.getInitialProps = async (props: any) => {
//   console.log(props)
//   return {}
// }

export default withRouter(BooksNew)
