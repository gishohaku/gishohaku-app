import { NextPage } from 'next'

import firebase from 'firebase/app'
import 'firebase/firestore'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Loader from '../../../../components/Loader'
import FormContainer from '../../../../components/FormContainer'
import { User } from '../../../../contexts/UserContext'
import CircleForm from '../../../../components/CircleForm'
import Circle from '../../../../utils/circle'
import withUser from '../../../../withUser'
import { db } from '../../../../utils/firebase'


const BooksNew: NextPage<{
  user: firebase.User
  userData: User
}> = ({ user }) => {
  const router = useRouter()
  const [circle, setCircle] = useState<Circle>()

  useEffect(() => {
    const id = router.query.id as string
    if (!id) { return }
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
            const id = router.query.id as string
            const query = db.collection('circles').doc(id)
            await query.update(circle)
            router.push(`/gishohaku1/mypage/circle`)
          }}
        />
      </FormContainer>
    </>
  )
}

export default withUser(BooksNew)
