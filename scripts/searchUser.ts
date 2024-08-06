/**
 * command-line:
 * ts-node scripts/searchUser.ts
 */
import admin from 'firebase-admin'

admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
});

(async () => {
  const db = admin.firestore()
  const query = db.collection('users').where("email", "==", "foot555ball@gmail.com")
  const snapshot = await query.get()
  snapshot.docs.forEach(async doc => {
    console.log(doc.id)
  })
})()
