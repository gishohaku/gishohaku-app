import { useState, useEffect, useContext, useCallback } from 'react'
import { NextPage } from 'next'
import router, { withRouter, PublicRouterInstance } from 'next/router'

import firebase from 'firebase/app'
import 'firebase/firestore'
import { useToast, Button, Divider } from 'sancho'

import BookForm from '../../components/BookForm'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import Book from '../../utils/book'
import UserContext from '../../contexts/UserContext'

interface Props {
  router: PublicRouterInstance
}

const BooksNew: NextPage<Props> = props => {
  const toast = useToast()
  const [book, setBook] = useState()
  const { user, isUserLoading, userData } = useContext(UserContext)

  useEffect(() => {
    const id = props.router.query.id as string
    const db: firebase.firestore.Firestore = firebase.firestore()
    db.collection('books')
      .doc(id)
      .get()
      .then(docRef => {
        console.log(docRef)
        setBook({
          id: docRef.id,
          ...(docRef.data() as Book)
        })
      })
  }, [props.router.query.id])

  const deleteBook = useCallback(async () => {
    if (!confirm('頒布物を削除しますか？')) {
      return
    }
    const id = props.router.query.id as string
    const db = firebase.firestore()
    await db
      .collection('books')
      .doc(id)
      .delete()
    toast({
      title: '頒布物を削除しました',
      intent: 'success'
    })
    props.router.push('/mypage/circle')
  }, [props.router.query.id])

  if (isUserLoading || !user || !book) {
    return <Loader />
  }

  if (!isUserLoading && (!userData || !userData.circleRef)) {
    return <p>サークル専用ページです。</p>
  }

  return (
    <>
      <FormContainer>
        <BookForm
          user={user}
          book={book}
          onSubmit={book => {
            const db: firebase.firestore.Firestore = firebase.firestore()
            const id = props.router.query.id as string
            db.collection('books')
              .doc(id)
              .update({
                ...book,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              })
              .then(_ => {
                router.push('/mypage/circle')
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

export default withRouter(BooksNew)
