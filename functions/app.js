const functions = require('firebase-functions')
const next = require('next')
const routes = require('./routes')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, conf: { distDir: 'next' } })
const handler = routes.getRequestHandler(app)
module.exports = functions.https.onRequest((req, res) =>
  app.prepare().then(() => handler(req, res))
)
