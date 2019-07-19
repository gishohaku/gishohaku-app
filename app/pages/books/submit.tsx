/** @jsx jsx */
import { useEffect, useContext, useState } from 'react'

import { NextPage } from 'next'
import { withRouter } from 'next/router'

import firebase from 'firebase/app'
import 'firebase/firestore'
import { jsx, css } from '@emotion/core'

import withCircleUser from '../../withCircleUser'
import Book from '../../utils/book'
import FormContainer from '../../components/FormContainer'
import UserContext from '../../contexts/UserContext'
import Loader from '../../components/Loader'
import BookSubmitForm from '../../components/BookSubmitForm'

const title = css`
  font-weight: 600;
  font-size: 18px;
`

const description = css`
  margin-top: 8px;
  margin-bottom: 12px;
`

const BooksSubmit: NextPage<any> = ({ router }) => {
  const { userData } = useContext(UserContext)
  const [book, setBook] = useState()

  useEffect(() => {
    const id = router.query.id as string
    const db: firebase.firestore.Firestore = firebase.firestore()
    db.collection('books')
      .doc(id)
      .get()
      .then(docRef => {
        const data = docRef.data() as Book
        if (userData!.circleRef!.id !== data.circleRef.id) {
          router.push('/mypage')
        }
        setBook({ id, ...data })
      })
  }, [userData, router.query.id])

  if (!book) {
    return <Loader />
  }

  return (
    <FormContainer>
      <h2 css={title}>見本誌の提出</h2>
      <p css={description}>
        <b>「{book.title}」</b>の見本誌の提出を行います。
        <br />
        ファイルはzipにまとめてアップロードしてください。
        <br />
        ボードゲームや缶バッチなどのグッズ（書籍以外）はアップロード不要です。
        <br />
        ※当日サークルブースにて確認させていただきます。
      </p>
      <BookSubmitForm book={book} />
    </FormContainer>
  )
}

export default withCircleUser(withRouter(BooksSubmit))
