const onRequest = require('firebase-functions').https.onRequest

const index = require('./next/serverless/pages/index')
const post = require('./next/serverless/pages/post')

exports.index = onRequest((req, res) => index.render(req, res))
exports.post = onRequest((req, res) => post.render(req, res))
