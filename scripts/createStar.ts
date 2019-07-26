const admin = require('firebase-admin')

admin.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
})

const main = async () => {
  const db = admin.firestore()
  const circleId = '0nsyABa1xIVSm3p8nhDq'
  const circleRef = db.collection('circles').doc(circleId)
  const documentId = circleRef.path.replace('/', '-')
  const ref = db.collection('starCounts').doc(documentId)
  console.log(circleRef.parent.id)
  // ref.set(
  //   {
  //     ref: circleRef,
  //     count: admin.firestore.FieldValue.increment(1)
  //   },
  //   { merge: true }
  // )
}

main()
