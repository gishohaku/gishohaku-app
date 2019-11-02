import { useState, useEffect, useCallback, useContext } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import firebase from 'firebase/app'
import 'firebase/firestore'
import { useToast, Button, Divider } from 'sancho'

import BookForm from '../../../../components/BookForm'
import Loader from '../../../../components/Loader'
import FormContainer from '../../../../components/FormContainer'
import Book from '../../../../utils/book'
import { User } from '../../../../contexts/UserContext'
import withUser from '../../../../withUser'
import EventContext from '../../../../contexts/EventContext'

interface Props {
  user: firebase.User
  userData: User
}

const BooksNew: NextPage<Props> = ({ user, userData }) => {
  const toast = useToast()
  const { eventId } = useContext(EventContext)
  const router = useRouter()
  const [book, setBook] = useState()
  const id = router.query.id as string
  // Redirect
  if (!id) { return null }
  const circleRef = userData.event && userData.event[eventId]

  useEffect(() => {
    const db: firebase.firestore.Firestore = firebase.firestore()
    const query = db.collection('books').doc(id)
    query.get().then(docRef => {
      setBook({
        id: docRef.id,
        ...(docRef.data() as Book)
      })
    })
  }, [id])

  const deleteBook = useCallback(async () => {
    if (!confirm('頒布物を削除しますか？')) {
      return
    }
    const db = firebase.firestore()
    const query = db.collection('books').doc(id)
    await query.delete()
    toast({
      title: '頒布物を削除しました',
      intent: 'success'
    })
    router.push('/[eventId]/mypage/circle', `/${eventId}/mypage/circle`)
  }, [id])

  if (!book) { return <Loader /> }
  if (!circleRef) { return <p>サークル専用ページです。</p> }

  return (
    <>
      <FormContainer>
        <BookForm
          user={user}
          book={book}
          onSubmit={book => {
            const db: firebase.firestore.Firestore = firebase.firestore()
            const id = router.query.id as string
            const query = db.collection('books')
              .doc(id)
              .update({
                ...book,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              })
            query.then(_ => {
              router.push(`/${eventId}/mypage/circle`)
            })
          }}
        />
        <Divider />
      </FormContainer>
      <FormContainer>
        <Button intent="danger" onPress={deleteBook} block>
          削除する
        </Button>
      </FormContainer>
    </>
  )
}

export default withUser(BooksNew)
