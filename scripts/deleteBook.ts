import * as admin from 'firebase-admin'
// const admin = require('firebase-admin')

admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
})

const db = admin.firestore()

const main = async () => {
  const bookRef = await db.doc('books/fJQrkkJAP8xFdNrfHgdd')
  const stars = await db
    .collectionGroup('bookStars')
    .where('bookRef', '==', bookRef)
    .get()

  console.log(stars)
}

main()
