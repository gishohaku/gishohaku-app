import admin from 'firebase-admin'

admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
});

(async () => {
  const db = admin.firestore()

  const users = await db.collection('users').limit(3).get()
  const eventId = 'gishohaku1'
  for await (let user of users.docs) {
    console.log('= ', user.id)
    const circleStars = await user.ref.collection('circleStars').get()
    const circleStarIds = circleStars.docs.map(star => star.id)
    console.log(circleStarIds)
    const bookStars = await user.ref.collection('bookStars').get()
    const bookStarIds = bookStars.docs.map(star => star.id)
    console.log(bookStarIds)

    user.ref.collection('stars').doc(eventId).set({
      circleStars: circleStarIds,
      bookStars: bookStarIds,
    })
  }
})()
