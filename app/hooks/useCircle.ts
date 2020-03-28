import { useEffect, useState } from 'react'
import Circle from '../utils/circle'
import { db } from '../utils/firebase'

const useCircle = (id?: string) => {
  const [circle, setCircle] = useState<Circle>()
  useEffect(() => {
    const ref = db.collection('circles').doc(id)
    if (!ref) return
    ref.get().then((snapshot) => {
      setCircle({
        id: snapshot.id,
        ...(snapshot.data() as Circle),
      })
    })
  }, [id])
  return { circle }
}

export default useCircle
