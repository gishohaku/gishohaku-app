// const firebase = require('firebase/app')
// import firebase from 'firebase/app'
// import 'firebase/storage'
// const admin = require('firebase-admin')
import admin from 'firebase-admin'
// require('firebase/storage')

admin.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
})

const main = async () => {
  const books = await admin.firestore().collection('books').get()
  let bookMap = {}
  books.forEach(snap => {
    bookMap[snap.id] = snap.data().title
  })

  console.log(bookMap)

  const snaps = await admin.firestore().collection('bookSubmissions').get()
  snaps.forEach(snap => {
    const data = snap.data()
    const createdAt = new Date(data.createdAt._seconds * 1000)
    console.log([snap.id, bookMap[snap.id], data.originalName, createdAt, data.url].join(", "))
  })
}

main()
