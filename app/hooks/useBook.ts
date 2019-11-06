import { useEffect, useState } from 'react'
import Book from '../utils/book'
import { db } from '../utils/firebase'

const useBook = (id?: string) => {
  const [book, setBook] = useState<Book>()
  useEffect(() => {
    const ref = db.collection('books').doc(id)
    if (!ref) return
    ref.get().then(snapshot => {
      if (!snapshot.exists) return
      setBook({
        id: snapshot.id,
        ...(snapshot.data() as Book)
      })
    })
  }, [id])
  return { book }
}

export default useBook