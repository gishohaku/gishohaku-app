// import admin from 'firebase-admin'
// import functions from 'firebase-functions'
const admin = require('firebase-admin')
const functions = require('firebase-functions')

const onCall = functions.region('asia-northeast1').https.onCall
const auth = functions.region('asia-northeast1').auth

// https://firebase.google.com/docs/functions/locations#http_and_client_callable_functions
// HostingでRewriteできる関数はus-central1を利用する必要がある
const onRequest = functions.https.onRequest

admin.initializeApp();

const next = require('next')
const routes = require('./routes')
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev, conf: { distDir: "next" } })
const handler = routes.getRequestHandler(app)

exports.app = onRequest((req, res) => (app.prepare().then(
  () => handler(req, res)
)))

exports.saveUser = auth.user().onCreate((user) => {
  console.log(user)
  const userDoc = {
    email: user.email,
    displayName: user.displayName
  }
  admin.firestore().collection('users').doc(user.uid).set(userDoc).then(result => {
    console.log(result)
    return
  })
})

exports.receiveInvitation = onCall(async (data, context) => {
  const token = data.token
  const circleId = data.circleId
  const auth = context.auth
  console.log(data, context.auth)
  if (!token || !circleId || !auth) {
    return { message: '無効な招待リンクです。'}
  }
  const firestore = admin.firestore()
  const snapshot = await firestore.collection(`circles/${circleId}/circleInvitations`).doc(token).get()
  if (!snapshot) {
    return { message: '無効な招待リンクです。'}
  }
  console.log(snapshot.data())
  const result = await firestore.collection('users').doc(auth.uid).set({
    circleRef: firestore.collection('circles').doc(circleId)
  }, { merge: true })
  return { message: 'サークルに参加しました。' }
})

exports.apiCircles = onCall(async (data, context) => {
  const snapshots = await admin.firestore().collection('circles').get()
  const circles = []
  snapshots.forEach(circle => {
    const data = circle.data()
    circles.push({
      id: circle.id,
      ...data
    })
  })
  return circles
})


exports.apiBooks = onCall(async (data, context) => {
  const snapshots = await admin.firestore().collection('books').get()
  const books = []
  snapshots.forEach(book => {
    const data = book.data()
    books.push({
      id: book.id,
      ...data
    })
  })
  return books
})