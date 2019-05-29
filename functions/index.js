// import admin from 'firebase-admin'
// import functions from 'firebase-functions'
const admin = require('firebase-admin')
const functions = require('firebase-functions')

const onCall = functions.https.onCall

// https://firebase.google.com/docs/functions/locations#http_and_client_callable_functions
// HostingでRewriteできる関数はus-central1を利用する必要がある
const onRequest = functions.https.onRequest
const onRequestAsia = functions.region('asia-northeast1').https.onRequest

admin.initializeApp();

const next = require('next')
const routes = require('./routes')
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev, conf: { distDir: "next" } })
const handler = routes.getRequestHandler(app)

exports.app = onRequest((req, res) => (app.prepare().then(
  () => handler(req, res)
)))

exports.receiveInvitation = onCall(async (data, context) => {
  const token = data.token
  const circleId = data.circleId
  const auth = context.auth
  console.log(data, context.auth)
  if (!token || !circleId || !auth) {
    return { message: '無効な招待リンクです。' }
  }
  const firestore = admin.firestore()
  const snapshot = await firestore.collection(`circles/${circleId}/circleInvitations`).doc(token).get()
  if (!snapshot) {
    return { message: '無効な招待リンクです。' }
  }
  console.log(snapshot.data())
  const result = await firestore.collection('users').doc(auth.uid).set({
    circleRef: firestore.collection('circles').doc(circleId)
  }, { merge: true })
  return { message: 'サークルに参加しました。' }
})

exports.apiCircles = onRequest(async (req, res) => {
  const snapshots = await admin.firestore().collection('circles').get()
  const circles = []
  snapshots.forEach(circle => {
    const data = circle.data()
    circles.push({
      id: circle.id,
      ...data
    })
  })
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'public, s-maxage=300')
  res.set('Access-Control-Allow-Origin', "*")
  res.status(200).send(JSON.stringify(circles))
})

exports.apiBooks = onRequest(async (req, res) => {
  const snapshots = await admin.firestore().collection('books').get()
  const books = []
  snapshots.forEach(book => {
    books.push({
      id: book.id,
      ...book.data()
    })
  })
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'public, s-maxage=300')
  res.set('Access-Control-Allow-Origin', "*")
  res.status(200).send(JSON.stringify(books))
})

exports.addCircleRefToStarCounts = functions.firestore.document('starCounts/{countId}').onCreate(async (snap) => {
  const data = snap.data()
  const collectionName = data.ref.parent.id
  console.log('starred:', data.ref.path)
  switch (collectionName) {
    case 'books':
      const bookSnapshot = await data.ref.get()
      const circleRef = bookSnapshot.data().circleRef
      snap.ref.set({ circleRef }, { merge: true })
      break;
    case 'circles':
      snap.ref.set({ circleRef: data.ref }, { merge: true })
      break;
    default:
      console.error('Unexpected document:', collectionName, data.ref)
  }
})