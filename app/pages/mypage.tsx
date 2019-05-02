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
import { refToPath, Book } from '../utils/firebase'
import { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext';

const Mypage = (props: any) => {
  const user: any = useContext(UserContext)
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
    } else {
      const db = firebase.firestore()
      db.collection('users').doc(user.uid).get().then(async (doc) => {
        const circleRef = doc.data().circleRef
        const snapshots = await db.collection('books').where("circleRef", "==", circleRef).get()
        let bookResults = []
        snapshots.forEach(book => {
          const data = book.data()
          bookResults.push({
            id: book.id,
            ...refToPath(data, 'circleRef')
          })
        })
        setBooks(bookResults)
        setLoading(false)
      })
    }
  }, [user])

  return (
    <Layout tab={props.router.query.tab}>
      {isLoading ?
        <Spinner label="Loading..." center /> :
        <>
          {
            books.map(book => {
              return <div key={book.id}>
                {book.title}
                <Link href={`/books/edit?id=${book.id}`} as={`/books/${book.id}/edit`}>
                  <span>
                    Edit
                  </span>
                </Link>
              </div>
            })
          }
          <Link href='/books/new'><span>new Book</span></Link>
        </>
      }
    </Layout>
  )
}

export default withRouter(Mypage)
