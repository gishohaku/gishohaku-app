const admin = require('firebase-admin')
const functions = require('firebase-functions')
const { Storage } = require('@google-cloud/storage')

const app = require('./app')
exports.app = app

// https://firebase.google.com/docs/functions/locations#http_and_client_callable_functions
// HostingでRewriteできる関数はus-central1を利用する必要がある
const onRequest = functions.https.onRequest
const onRequestAsia = functions.region('asia-northeast1').https.onRequest

const onCall = functions.https.onCall

admin.initializeApp()

exports.receiveInvitation = onCall(async (data, context) => {
  const token = data.token
  const circleId = data.circleId
  const auth = context.auth
  console.log(data, context.auth)
  if (!token || !circleId || !auth) {
    return { message: '無効な招待リンクです。' }
  }
  const firestore = admin.firestore()
  const snapshot = await firestore
    .collection(`circles/${circleId}/circleInvitations`)
    .doc(token)
    .get()
  if (!snapshot) {
    return { message: '無効な招待リンクです。' }
  }
  console.log(snapshot.data())
  const result = await firestore
    .collection('users')
    .doc(auth.uid)
    .set(
      {
        circleRef: firestore.collection('circles').doc(circleId)
      },
      { merge: true }
    )
  return { message: 'サークルに参加しました。' }
})

exports.apiCircles = onRequest(async (req, res) => {
  const snapshots = await admin
    .firestore()
    .collection('circles')
    .where("eventId", "==", "gishohaku1")
    .orderBy('boothNumber', 'asc')
    .get()
  const circles = []
  snapshots.forEach(circle => {
    const data = circle.data()
    circles.push({
      id: circle.id,
      ...data
    })
  })
  res.set('Content-Type', 'application/json')
  res.set('Cache-Control', 'public, s-maxage=3600')
  res.set('Access-Control-Allow-Origin', '*')
  res.status(200).send(JSON.stringify(circles))
})

exports.apiBooks = onRequest(async (req, res) => {
  const snapshots = await admin
    .firestore()
    .collection('books')
    .where("eventId", "==", "gishohaku1")
    .get()
  const books = []
  snapshots.forEach(book => {
    books.push({
      id: book.id,
      ...book.data()
    })
  })
  res.set('Content-Type', 'application/json')
  res.set('Cache-Control', 'public, s-maxage=600')
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, PURGE')
  res.status(200).send(JSON.stringify(books))
})

exports.addCircleRefToStarCounts = functions.firestore
  .document('starCounts/{countId}')
  .onCreate(async snap => {
    const data = snap.data()
    const collectionName = data.ref.parent.id
    console.log('starred:', data.ref.path)
    switch (collectionName) {
      case 'books':
        const bookSnapshot = await data.ref.get()
        const circleRef = bookSnapshot.data().circleRef
        snap.ref.set({ circleRef }, { merge: true })
        break
      case 'circles':
        snap.ref.set({ circleRef: data.ref }, { merge: true })
        break
      default:
        console.error('Unexpected document:', collectionName, data.ref)
    }
  })

exports.onCreateFile = functions.storage.object().onFinalize(async (object, context) => {
  console.log(object, context)
  const filePath = object.name
  if (!filePath.startsWith('submissions/')) {
    console.log('check submissions')
    return
  }

  const fileBucket = object.bucket
  const storage = new Storage()
  const bucket = storage.bucket(fileBucket)
  const urls = await bucket.file(filePath).getSignedUrl({
    action: 'read',
    expires: '03-09-2491'
  })
  const [_directory, bookId, _timestamp] = object.name.split('/')

  const submission = {
    originalName: object.metadata.originalName,
    path: object.name,
    contentType: object.contentType,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    isChecked: false,
    url: urls[0]
  }

  await admin
    .firestore()
    .collection('bookSubmissions')
    .doc(bookId)
    .set(submission)
  console.log(filePath, bookId, submission)
})
