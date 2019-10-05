import { NextPage } from 'next'

import firebase from 'firebase/app'
import 'firebase/firestore'

import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'

import Loader from '../../../../components/Loader'
import FormContainer from '../../../../components/FormContainer'
import { User } from '../../../../contexts/UserContext'
import EventContext from '../../../../contexts/EventContext'
import CircleForm from '../../../../components/CircleForm'
import Circle from '../../../../utils/circle'
import withUser from '../../../../withUser'


const BooksNew: NextPage<{
  user: firebase.User
  userData: User
}> = ({ user }) => {
  const router = useRouter()
  const { eventId } = useContext(EventContext)
  const [circle, setCircle] = useState<Circle>()

  useEffect(() => {
    const id = router.query.id as string
    if (!id) { return }
    const db: firebase.firestore.Firestore = firebase.firestore()
    const query = db.collection('circles').doc(id)
    query.get().then(docRef => {
      console.log(docRef)
      setCircle({ id: docRef.id, ...(docRef.data() as Circle) })
    })
  }, [router.query.id])

  if (!circle) { return <Loader /> }

  return (
    <>
      <FormContainer>
        <CircleForm
          user={user}
          circle={circle}
          onSubmit={async circle => {
            const db = firebase.firestore()
            const id = router.query.id as string
            const query = db.collection('circles').doc(id)
            await query.update(circle)
            router.push(`/${eventId}/mypage/circle`)
          }}
        />
      </FormContainer>
    </>
  )
}

export default withUser(BooksNew)
