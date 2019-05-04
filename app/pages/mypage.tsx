/** @jsx jsx */
import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

import { jsx, css, Global } from '@emotion/core'

import circleTumbnail from '../images/cirlceTumbnail.png'

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
  const [circle, setCircle] = useState()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
    } else {
      const db = firebase.firestore()
      db.collection('users').doc(user.uid).get().then(async (doc) => {
        const circleRef = doc.data()!.circleRef
        // Promise.all
        const circleSnapShot = await circleRef.get()
        setCircle(circleSnapShot.data())
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
        setLoading(false)
      })
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
      <Global styles={{
        body: {
          backgroundColor: "#F7F8FA"
        }
      }} />
      <div css={css`
        max-width: ${1080 + 32}px;
        padding: 0 16px;
        margin: 32px auto;
        display: flex;
      `}>
        <div css={css`
          width: 258px;
          margin-right: 48px;
        `}>
          {circle &&
            <>
              <img src={circleTumbnail} />
              {circle.name}
            </>
          }
        </div>
        <div css={css`
          flex: 1;
        `}>
          {
            books.map(book => {
              return <div css={css`
                background-color: white;
                margin-bottom: 24px;
                padding: 24px;

              `} key={book.id}>
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
      </div>
    </Layout>
  )
}

export default withRouter(Mypage)
