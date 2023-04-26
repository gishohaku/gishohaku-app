/**
 * command-line:
 * ts-node scripts/20230426-createInvitation.ts
 */
import admin from 'firebase-admin'

admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
});

(async () => {
  const db = admin.firestore()
  const query = db.collection('circles').where("eventId", "==", "gishohaku8")
  const snapshot = await query.get()
  snapshot.docs.forEach(async doc => {
    const { name } = doc.data()
    // console.log(doc.id, name)
    const result = await doc.ref.collection('circleInvitations').add({
      eventId: "gishohaku8"
    })
    const token = result.id
    console.log([
      doc.id,
      name,
      token,
      `https://gishohaku.dev/gishohaku8/mypage/join?circleId=${doc.id}&token=${token}`
    ].join(", "))
  })
})()