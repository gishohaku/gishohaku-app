/** @jsx jsx */
import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

import { jsx, css } from '@emotion/core'

import {
  Spinner, Button
} from 'sancho'
import Layout from '../components/Layout'
import { withRouter } from 'next/router'
import { refToPath, Book } from '../utils/firebase'
import { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext';

const Mypage = (props: any) => {
  const { user, isUserLoading } = useContext(UserContext)
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
    } else {
      const db = firebase.firestore()
      db.collection('users').doc(user.uid).get().then(async (doc) => {
        const circleRef = doc.data()!.circleRef
        if (circleRef) {
          const snapshots = await db.collection('books').where("circleRef", "==", circleRef).get()
          let bookResults: Book[] = []
          snapshots.forEach(book => {
            const data = book.data()
            bookResults.push({
              id: book.id,
              ...refToPath(data, 'circleRef') as Book
            })
          })
          setBooks(bookResults)
        }
      })
      setLoading(false)
    }
  }, [user])

  console.log(isLoading, isUserLoading, books)

  if (isLoading || isUserLoading) {
    return <Layout>
      <Spinner label="Loading..." center />
    </Layout>
  }

  if (!user) {
    return <Layout>
      <p>ログインしてください</p>
     <Button onClick={() => {
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider).then(function (result) {
          console.log(result)
        })
      }}>
        Login
      </Button>
    </Layout>
  }

  return (
    <Layout tab={props.router.query.tab}>
      <div css={css`
        max-width: 1080px;
        margin: 0 auto;
      `}>
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
      </div>
    </Layout>
  )
}

export default withRouter(Mypage)
