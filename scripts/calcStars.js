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
  const db = admin.firestore()

  const circleStars = await db.collectionGroup('circleStars').get()
  console.log('サークルチェック', circleStars.size)
  const bookStars = await db.collectionGroup('bookStars').get()
  console.log('頒布物チェック', bookStars.size)

  const starCounts = await db.collection('starCounts').orderBy('count', 'desc').limit(20).get()
  starCounts.forEach(a => {
    const { ref, count } = a.data()
    ref.get().then(b => {
      const { name, title} = b.data()
      console.log([ref.path, name || title, count].join(", "))
    })
  })
}

main()
