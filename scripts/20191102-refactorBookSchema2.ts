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
    doc.ref.update({
      circleSpace: admin.firestore.FieldValue.delete(),
      circleBooth: admin.firestore.FieldValue.delete(),
      circleName: admin.firestore.FieldValue.delete()
    })
  })
})()
