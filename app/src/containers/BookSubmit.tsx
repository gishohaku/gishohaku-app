/** @jsx jsx */
import { useContext, useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { jsx, css } from '@emotion/core'

import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import BookSubmitForm from '../components/BookSubmitForm'
import withUser from '../withUser'
import EventContext from '../contexts/EventContext'
import useBook from '../hooks/useBook'

const title = css`
  font-weight: 600;
  font-size: 18px;
`

const description = css`
  margin-top: 8px;
  margin-bottom: 12px;
`

const BooksSubmit: NextPage<any> = ({ userData }) => {
  const router = useRouter()
  const { eventId } = useContext(EventContext)
  const circleRef = userData.event && userData.event[eventId]
  const id = router.query.id as string
  const { book } = useBook(id)

  useEffect(() => {
    window.location = '/'
  }, [])

  if (!circleRef) {
    return <p>サークル参加者向けページです。</p>
  }

  if (!book) {
    return <Loader />
  }

  return (
    <FormContainer>
      <h2 css={title}>見本誌の提出</h2>
      <p css={description}>
        <b>「{book.title}」</b>の見本誌の提出を行います。
        <br />
        ファイルはzipにまとめてアップロードしてください。（100MBまで）
        <br />
        ボードゲームや缶バッチなどのグッズ（書籍以外）はアップロード不要です。
        <br />
        ※当日サークルブースにて確認させていただきます。
      </p>
      <BookSubmitForm book={book} />
    </FormContainer>
  )
}

export default withUser(BooksSubmit)
