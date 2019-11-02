import { NextPage } from 'next'

import firebase from 'firebase/app'
import 'firebase/firestore'

import { useContext } from 'react'
import { useRouter } from 'next/router'

import Loader from '../../../../components/Loader'
import FormContainer from '../../../../components/FormContainer'
import { User } from '../../../../contexts/UserContext'
import EventContext from '../../../../contexts/EventContext'
import CircleForm from '../../../../components/CircleForm'
import withUser from '../../../../withUser'
import useCircle from '../../../../hooks/useCircle'


const CircleEdit: NextPage<{
  user: firebase.User
  userData: User
}> = ({ user }) => {
  const router = useRouter()
  const { eventId } = useContext(EventContext)

  const db: firebase.firestore.Firestore = firebase.firestore()
  const id = router.query.id as string
  const docRef = db.collection('circles').doc(id)
  const { circle } = useCircle(docRef)

  if (!circle) { return <Loader /> }

  return (
    <FormContainer>
      <CircleForm
        user={user}
        circle={circle}
        onSubmit={async circle => {
          const query = db.collection('circles').doc(id)
          await query.update(circle)
          router.push(`/${eventId}/mypage/circle`)
        }}
      />
    </FormContainer>
  )
}

export default withUser(CircleEdit)
