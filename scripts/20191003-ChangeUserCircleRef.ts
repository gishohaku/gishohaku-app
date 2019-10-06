import admin from 'firebase-admin'

admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
});

(async () => {
  const db = admin.firestore()

  const users = await db.collection('users').get()
  users.docs.forEach(doc => {
    const data = doc.data()
    if (data.circleRef)
      doc.ref.update({
        event: {
          gishohaku1: data.circleRef
        }
      })
  })

  // 初回のみ
  if (false) {
    const circles = await db.collection('circles').get()
    circles.docs.forEach(doc => {
      doc.ref.update({
        eventId: 'gishohaku1'
      })
    })

    const books = await db.collection('books').get()
    books.docs.forEach(doc => {
      doc.ref.update({
        eventId: 'gishohaku1'
      })
    })

    const counts = await db.collection('starCounts').get()
    counts.docs.forEach(doc => {
      doc.ref.update({
        eventId: 'gishohaku1'
      })
    })
  }
})()
