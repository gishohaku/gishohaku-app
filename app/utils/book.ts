import { firestore } from "firebase"

export const mediums = {
  degital: '電子',
  paper: '紙',
  both: '紙/電子'
}

export const types = {
  fanzine: '同人誌',
  commerce: '商業誌'
}

export type BookType = keyof typeof types
export type BookMedium = keyof typeof mediums

export default interface Book {
  id?: string
  title: string
  description: string
  price: number
  stock: number
  pages: number
  images: string[]
  type: BookType
  // 新刊か？
  isNew: boolean
  // 頒布形態
  medium: BookMedium | '' | null
  sampleUrl: string
  purchaseUrl: string
  circleRef?: any
  circleName?: string
  circleBooth?: string
  circle?: {
    ref: firestore.DocumentReference
    name: string
    booth: string
    id: string
  }
  updatedAt?: firebase.firestore.Timestamp
}

export const refToId = (book: Book) => {
  if (!book.circle) return book

  const results: Book = {
    ...book,
    circle: {
      ...book.circle,
      id: book.circle!.ref.id
    }
  }

  delete results.circleRef
  delete results.circle!.ref

  return results
}