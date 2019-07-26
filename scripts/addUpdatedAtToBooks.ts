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
  snapshots.forEach(snapshot => {
    const book = {
      id: snapshot.id,
      ...snapshot.data()
    }
    if (!book.updatedAt) {
      console.log(book)
      snapshot.ref.set(
        {
          updatedAt: book.createdAt
        },
        { merge: true }
      )
    }
  })
}

main()
