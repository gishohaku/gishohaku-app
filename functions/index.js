const onRequest = require('firebase-functions').https.onRequest

const index = require('./next/serverless/pages/index')
const books = require('./next/serverless/pages/books')
const showBook = require('./next/serverless/pages/books/_id')

exports.index = onRequest((req, res) => index.render(req, res))
exports.books = onRequest((req, res) => books.render(req, res))
exports.showBook = onRequest((req, res) => showBook.render(req, res))