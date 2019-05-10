const admin = require('firebase-admin')
const functions = require('firebase-functions')

const onRequest = functions.https.onRequest
const onCall = functions.https.onCall

admin.initializeApp();

// const index = require('./next/serverless/pages/index')
// const books = require('./next/serverless/pages/books')
// const showBook = require('./next/serverless/pages/books/_id')

// exports.index = onRequest((req, res) => index.render(req, res))
// exports.books = onRequest((req, res) => books.render(req, res))
// exports.showBook = onRequest((req, res) => showBook.render(req, res))

const next = require('next')
const routes = require('./routes')
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev, conf: { distDir: "next" } })
const handler = routes.getRequestHandler(app)

exports.app = onRequest((req, res) => (app.prepare().then(
  () => handler(req, res)
)))

exports.saveUser = functions.auth.user().onCreate((user) => {
  console.log(user)
  userDoc = {
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