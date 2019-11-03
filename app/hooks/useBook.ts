import { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import Book from '../utils/book'

const useBook = (id?: string) => {
  const [book, setBook] = useState<Book>()
  useEffect(() => {
    const db: firebase.firestore.Firestore = firebase.firestore()
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