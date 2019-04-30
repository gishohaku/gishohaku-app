import { firestore } from 'firebase'

import {
  Container,
} from 'sancho'
import Layout from '../../components/layout'
import BookForm from '../../components/BookForm'
import router, { withRouter } from 'next/router'

// interface Book {
//   id: string
//   title: string
// }

const BooksNew = (props: any) => {
  return (
    <Layout tab={props.router.query.tab}>
      <Container>
        <BookForm onSubmit={(event, book) => {
          const db = firestore()
          db.collection("books").add(book).then((docRef) => {
            console.log(docRef)
            // debugger
            router.push('/books')
          })
          event.preventDefault()
        }} />
      </Container>
    </Layout >
  )
}

export default withRouter(BooksNew)
