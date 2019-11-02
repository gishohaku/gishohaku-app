import { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import Circle from '../utils/circle'

const useCircle = (id?: string) => {
  const [circle, setCircle] = useState<Circle>()
  useEffect(() => {
    const db: firebase.firestore.Firestore = firebase.firestore()
    const ref = db.collection('circles').doc(id)
    if (!ref) return
    ref.get().then(snapshot => {
      setCircle({
        id: snapshot.id,
        ...(snapshot.data() as Circle)
      })
    })
  }, [id])
  return { circle }
}

export default useCircle