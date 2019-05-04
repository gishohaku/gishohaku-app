import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

import {
  Spinner
} from 'sancho'
import Layout from '../components/Layout'
import { withRouter } from 'next/router'
import { refToPath, Book } from '../utils/firebase'
import { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext';

const Mypage = (props: any) => {
  const { user } = useContext(UserContext)
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
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
          setLoading(false)
        }
      })
    }
  }, [user])

  const handleClick = async () => {
    const receiveInvitation = firebase.functions().httpsCallable('receiveInvitation')
    const result = await receiveInvitation({
      circleId: '',
      token: ''
    })
    console.log(result)
  }

  return (
    <Layout tab={props.router.query.tab}>
      <button onClick={handleClick}>aaaaa</button>
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
