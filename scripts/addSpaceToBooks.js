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
  for (let doc of snapshots.docs) {
    const data = doc.data()
    console.log(doc.id, data.title, data.circleName)
    const circleSnapshot = await data.circleRef.get()
    console.log(circleSnapshot.data().booth)
    await doc.ref.set(
      {
        circleBooth: circleSnapshot.data().booth
      },
      {
        merge: true
      }
    )
  }
}

main()
