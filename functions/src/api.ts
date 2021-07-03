import * as functions from 'firebase-functions'
import admin from 'firebase-admin'

// https://firebase.google.com/docs/functions/locations#http_and_client_callable_functions
// HostingでRewriteできる関数はus-central1を利用する必要がある
const onRequest = functions.https.onRequest

// api-circles
export const circles = onRequest(async (_req, res) => {
  const snapshots = await admin
    .firestore()
    .collection('circles')
    .where("eventId", "==", "gishohaku1")
    .orderBy('boothNumber', 'asc')
    .get()
  const circles: any[] = []
  snapshots.forEach(circle => {
    const data = circle.data()
    circles.push({
      id: circle.id,
      ...data
    })
  })
  res.set('Content-Type', 'application/json')
  res.set('Cache-Control', 'public, max-age=60, s-maxage=3600')
  res.set('Access-Control-Allow-Origin', '*')
  res.status(200).send(JSON.stringify(circles))
})

// api-books
export const books = onRequest(async (_req, res) => {
  const snapshots = await admin
    .firestore()
    .collection('books')
    .where("eventId", "==", "gishohaku1")
    .get()
  const books: any[] = []
  snapshots.forEach(book => {
    books.push({
      id: book.id,
      ...book.data()
    })
  })
  res.set('Content-Type', 'application/json')
  res.set('Cache-Control', 'public, max-age=60, s-maxage=600')
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, PURGE')
  res.status(200).send(JSON.stringify(books))
})

// gishohaku/og-imageで利用するためのエンドポイント
export const book = onRequest(async (req, res) => {
  const bookId = req.query.id as string
  if (!bookId) {
    return res.status(400).end()
  }
  const ref = await admin.firestore().collection('books').doc(bookId).get()
  const data = ref.data()
  res.set('Content-Type', 'application/json')
  res.set('Cache-Control', 'public, max-age=60, s-maxage=600')
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, PURGE')
  res.status(200).send(JSON.stringify(data))
})