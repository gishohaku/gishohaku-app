import * as functions from 'firebase-functions'
import next from 'next'

if (process.env.DISABLE_APP) {
  const dev = process.env.NODE_ENV !== 'production'
  const app = next({ dev, conf: { distDir: 'next' } })
  const handler = app.getRequestHandler()
}

export default functions.https.onRequest((req, res) => {
  if (process.env.DISABLE_APP) {
    app.prepare().then(() => handler(req, res))
  }
})
