// import admin from 'firebase-admin'
const admin = require('firebase-admin')

admin.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
})

const db = admin.firestore()

const main = async () => {
  const snapshots = await db.collection('books').get()
  const books = []
  const booksByCircle = new Map()
  snapshots.forEach(snapshot => {
    const book = {
      id: snapshot.id,
      ...snapshot.data()
    }
    books.push(book)

    console.log(book.id, book.title, book.order)

    const circleBooks = booksByCircle.get(book.circleRef.path) || []
    if (!book.order) {
      // booksByCircle.set(book.circleRef.path, [...circleBooks, book])
    }
  })

  Array.from(booksByCircle).map(([circlePath, books]) => {
    console.log('===========', circlePath, books[0].circleName)
    const merge = true
    books.forEach((book, order) => {
      console.log(book.id, book.title)
      db.collection('books')
        .doc(book.id)
        .set({ order }, { merge })
    })
  })
}

main()
