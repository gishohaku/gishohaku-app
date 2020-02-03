import { useEffect, useState } from 'react'
import Circle from '../utils/circle'
import { db } from '../utils/firebase'

const useCircle = (id?: string) => {
  const [circle, setCircle] = useState<Circle>()
  const [circleRef, setRef] = useState<any>()
  useEffect(() => {
    const ref = db.collection('circles').doc(id)
    if (!ref) return
    setRef(ref)
    ref.get().then(snapshot => {
      setCircle({
        id: snapshot.id,
        ...(snapshot.data() as Circle)
      })
    })
  }, [id])
  return { circle, circleRef }
}

export default useCircle