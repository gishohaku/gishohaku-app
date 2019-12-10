import * as functions from 'firebase-functions'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, conf: { distDir: 'next' } })
const handler = app.getRequestHandler()

export default functions.https.onRequest((req, res) => {
  app.prepare().then(() => handler(req, res))
})
