import { useCallback, useContext } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useToast, Button, Divider } from 'sancho'

import BookForm from '../components/BookForm'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { User } from '../contexts/UserContext'
import withUser from '../withUser'
import EventContext from '../contexts/EventContext'
import useBook from '../hooks/useBook'
import { firebase, db } from '../utils/firebase'

interface Props {
  user: firebase.User
  userData: User
}

const BooksNew: NextPage<Props> = ({ user, userData }) => {
  const toast = useToast()
  const { eventId } = useContext(EventContext)
  const router = useRouter()
  const id = router.query.id as string
  const { book } = useBook(id)
  // Redirect
  if (!id) {
    return null
  }
  const circleRef = userData.event && userData.event[eventId]

  const deleteBook = useCallback(async () => {
    if (!confirm('頒布物を削除しますか？')) {
      return
    }
    const query = db.collection('books').doc(id)
    await query.delete()
    toast({
      title: '頒布物を削除しました',
      intent: 'success',
    })
    router.push('/[eventId]/mypage/circle', `/${eventId}/mypage/circle`)
  }, [id])

  if (!book) {
    return <Loader />
  }
  if (!circleRef) {
    return <p>サークル専用ページです。</p>
  }

  return (
    <>
      <FormContainer>
        <BookForm
          user={user}
          book={book}
          onSubmit={(book) => {
            const id = router.query.id as string
            const query = db
              .collection('books')
              .doc(id)
              .update({
                ...book,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              })
            query.then((_) => {
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
