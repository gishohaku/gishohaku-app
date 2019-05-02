const admin = require('firebase-admin')
const functions = require('firebase-functions')

const onRequest = functions.https.onRequest

admin.initializeApp();

// const index = require('./next/serverless/pages/index')
// const books = require('./next/serverless/pages/books')
// const showBook = require('./next/serverless/pages/books/_id')

// exports.index = onRequest((req, res) => index.render(req, res))
// exports.books = onRequest((req, res) => books.render(req, res))
// exports.showBook = onRequest((req, res) => showBook.render(req, res))

const next = require('next')
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev, conf: { distDir: "next" } })
const handle = app.getRequestHandler()

exports.app = onRequest((req, res) => (app.prepare().then(
  () => handle(req, res)
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