const admin = require('firebase-admin')

admin.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
})

const types = {
  fanzine: '同人誌',
  commerce: '商業誌'
}

const main = async () => {
  let submissionMap = {}
  const snaps = await admin.firestore().collection('bookSubmissions').get()
  snaps.docs.forEach(d => {
    submissionMap[d.id] = d.data()
  })

  let circleMap = {}
  const circleSnaps = await admin.firestore().collection('circles').get()
  circleSnaps.docs.forEach(d => {
    circleMap[d.id] = d.data()
  })

  const bookSnapshots = await admin.firestore().collection('books').get()
  let bookMap = {}
  const books = bookSnapshots.docs.map(doc => {
    const data = doc.data()
    const circle = circleMap[data.circleRef.path.replace('circles/', '')]
    // console.log(data.circleRef.path, circle)
    return {
      id: doc.id,
      circleNumber: circle.boothNumber,
      ...data,
    }
  }).sort((book1, book2) => {
    return book1.circleNumber - book2.circleNumber
  })
  // console.log(books.map(d => d.circleNumber))
  for (let book of books) {
    let submission = submissionMap[book.id]
    console.log([book.id, book.circleBooth, book.circleName, types[book.type], book.title, submission && submission.url, submission && (new Date(submission.createdAt._seconds * 1000))].join(", "))
  }
}

main()
