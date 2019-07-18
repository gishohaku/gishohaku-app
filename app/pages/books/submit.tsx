/** @jsx jsx */
import { useEffect, useContext, useState } from 'react'

import firebase from 'firebase/app'
import 'firebase/firestore'
import { jsx } from '@emotion/core'

import FormContainer from '../../components/FormContainer'
import Circle from '../../utils/circle'
import UserContext from '../../contexts/UserContext'
import { NextPage } from 'next'
import withCircleUser from '../../withCircleUser'
import Loader from '../../components/Loader'
import Book from '../../utils/book'
import { withRouter } from 'next/router'
import BookSubmitForm from '../../components/BookSubmitForm'

const BooksSubmit: NextPage<any> = props => {
  const { user, userData } = useContext(UserContext)
  const [circle, setCircle] = useState<Circle | null>(null)
  const [book, setBook] = useState()

  useEffect(() => {
    if (userData && userData.circleRef) {
      userData.circleRef.get().then(snapshot => {
        setCircle(snapshot.data() as Circle)
      })
    }
  }, [userData])

  useEffect(() => {
    const id = props.router.query.id as string
    const db: firebase.firestore.Firestore = firebase.firestore()
    db.collection('books')
      .doc(id)
      .get()
      .then(docRef => {
        setBook({
          id: docRef.id,
          ...(docRef.data() as Book)
        })
      })
  }, [props.router.query.id])

  console.log(circle, book)

  return circle && book ? (
    <FormContainer>
      見本誌の提出 見本誌の提出を行います。
      <BookSubmitForm user={user!} book={book} onSubmit={() => {}} />
    </FormContainer>
  ) : (
    <Loader />
  )
}

export default withCircleUser(withRouter(BooksSubmit))
