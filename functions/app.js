const functions = require('firebase-functions')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, conf: { distDir: 'next' } })
const handler = app.getRequestHandler()

module.exports = functions.https.onRequest((req, res) =>
  app.prepare().then(() => handler(req, res))
)
