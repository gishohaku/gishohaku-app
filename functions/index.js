const onRequest = require('firebase-functions').https.onRequest

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
