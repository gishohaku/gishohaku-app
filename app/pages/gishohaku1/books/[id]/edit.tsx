import { useState, useEffect, useCallback } from 'react'
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

interface Props {
  user: firebase.User
  userData: User
}

const BooksNew: NextPage<Props> = ({ user, userData }) => {
  const toast = useToast()
  const router = useRouter()
  const [book, setBook] = useState()

  useEffect(() => {
    const id = router.query.id as string
    if (!id) { return }
    const db: firebase.firestore.Firestore = firebase.firestore()
    const query = db.collection('books').doc(id)
    query.get().then(docRef => {
      setBook({
        id: docRef.id,
        ...(docRef.data() as Book)
      })
    })
  }, [router.query.id])

  const deleteBook = useCallback(async () => {
    if (!confirm('頒布物を削除しますか？')) {
      return
    }
    const id = router.query.id as string
    const db = firebase.firestore()
    const query = db.collection('books').doc(id)
    await query.delete()
    toast({
      title: '頒布物を削除しました',
      intent: 'success'
    })
    router.push('/gishohaku1/mypage/circle')
  }, [router.query.id])

  if (!book) { return <Loader /> }
  if (!userData.circleRef) { return <p>サークル専用ページです。</p> }

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
              router.push('/gishohaku1/mypage/circle')
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
