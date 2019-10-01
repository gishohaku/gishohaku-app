import admin from 'firebase-admin'

admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
});

(async () => {
  const db = admin.firestore()

  const books = await db.collection('books').get()
  books.docs.forEach(doc => {
    const { circleBooth, circleName, circleRef } = doc.data()
    doc.ref.update({
      circle: {
        ref: circleRef,
        name: circleName,
        booth: circleBooth
      },
      // circleSpace: admin.firestore.FieldValue.delete()
    })
  })
})()
