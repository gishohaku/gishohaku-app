import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/firestore'

import {
  List,
  ListItem,
  IconChevronRight,
  Spinner
} from 'sancho'
import Layout from '../components/layout'
import { withRouter } from 'next/router'
import { initFirebase, refToPath, Book } from '../utils/firebase'
import { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext';

const Mypage = (props: any) => {
  const user: any = useContext(UserContext)
  const [books, setBooks] = useState<Book[]>([])

  useEffect(() => {
    if (!user) {
    } else {
      const db = firebase.firestore()
      db.collection('users').doc(user.uid).get().then((doc) => {
        const userCircleRef = doc.data().circleRef
        db.collection('books').where("circleRef", "==", userCircleRef).get().then(snapshots => {
          console.log(snapshots)
          let bookResults = []
          snapshots.forEach(book => {
            const data = book.data()
            bookResults.push({
              id: book.id,
              ...refToPath(data, 'circleRef')
            })
            console.log(bookResults)
          })
          console.log('setBooks', bookResults)
          setBooks(bookResults)
        })
      })
    }
  }, [user])

  return (
    <Layout tab={props.router.query.tab}>
      <Link href='/books/new'><span>new Book</span></Link>
      <p>This is mypage</p>
      <Spinner label="Loading..." center />
      {books.map(book => {
        return <p>{book.title}</p>
      })}
    </Layout>
  )
}

export default withRouter(Mypage)
