const admin = require('firebase-admin')

admin.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
})

const eventId = 'gishohaku2'

const types = {
  fanzine: '同人誌',
  commerce: '商業誌'
}

const mediums = {
  degital: '電子',
  paper: '紙',
  both: '紙/電子'
}

const main = async () => {
  const db = admin.firestore()

  let submissionMap = {}
  const submissionQuery = db.collection('bookSubmissions').where('eventId', '==', eventId)
  const submissions = await submissionQuery.get()
  submissions.docs.forEach(d => {
    submissionMap[d.id] = d.data()
  })

  let circleMap = {}
  const circleQuery = db.collection('circles').where('eventId', '==', eventId)
  const circles = await circleQuery.get()
  circles.docs.forEach(d => {
    circleMap[d.id] = d.data()
  })

  const bookQuery = db.collection('books').where('eventId', '==', eventId)
  const books = (await bookQuery.get()).docs.map(doc => {
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
  for (let book of books) {
    let submission = submissionMap[book.id]
    console.log([book.id, `"${book.circle.booth}（${book.circle.name}）"`, types[book.type], mediums[book.medium], `"${book.title}"`, submission && submission.url, submission && (new Date(submission.createdAt._seconds * 1000))].join(", "))
  }
}

main()
