import admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { Storage } from '@google-cloud/storage'

export { default as app } from './app'

// https://firebase.google.com/docs/functions/locations#http_and_client_callable_functions
// HostingでRewriteできる関数はus-central1を利用する必要がある
const onRequest = functions.https.onRequest
const onRequestAsia = functions.region('asia-northeast1').https.onRequest

const onCall = functions.https.onCall

admin.initializeApp(functions.config().firebase)

export const receiveInvitation = onCall(async (data, context) => {
  const { token, circleId } = data
  const auth = context.auth
  console.log(data, context.auth)
  if (!token || !circleId || !auth) {
    return { message: '無効な招待リンクです。' }
  }
  const db = admin.firestore()
  const invitationRef = db.collection(`circles/${circleId}/circleInvitations`).doc(token)
  const snapshot = await invitationRef.get()
  if (!snapshot || !snapshot.exists) { return { message: '無効な招待リンクです。' } }
  const { eventId } = snapshot.data()!
  if (!eventId) { return { message: '無効なイベントです。' } }
  const targetRef = db.collection('users').doc(auth.uid)
  await targetRef.update({
    [`event.${eventId}`]: db.collection('circles').doc(circleId)
  })
  return { message: 'サークルに参加しました。' }
})

export const apiCircles = onRequest(async (req, res) => {
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

export const apiBooks = onRequest(async (req, res) => {
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

export const addCircleRefToStarCounts = functions.firestore
  .document('starCounts/{countId}')
  .onCreate(async snap => {
    const data: any = snap.data()
    const collectionName = data.ref.parent.id
    console.log('starred:', data.ref.path)
    switch (collectionName) {
      case 'books':
        const bookSnapshot = await data.ref.get()
        const circleRef = bookSnapshot.data().circleRef
        snap.ref.set({ circleRef }, { merge: true })
        break
      case 'circles':
        snap.ref.set({ circleRef: data.ref }, { merge: true })
        break
      default:
        console.error('Unexpected document:', collectionName, data.ref)
    }
  })

export const onCreateFile = functions.storage.object().onFinalize(async (object, context) => {
  console.log(object, context)
  const filePath = object.name as string
  if (!filePath.startsWith('submissions/')) {
    console.log('check submissions')
    return
  }

  const fileBucket = object.bucket
  const storage = new Storage()
  const bucket = storage.bucket(fileBucket)
  const urls = await bucket.file(filePath).getSignedUrl({
    action: 'read',
    expires: '03-09-2491'
  })
  const [_directory, bookId, _timestamp] = object.name!.split('/')

  const bookRef = await admin.firestore().collection('books').doc(bookId).get()
  const { eventId } = bookRef.data()!

  const submission = {
    originalName: object.metadata!.originalName,
    path: object.name,
    contentType: object.contentType,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    isChecked: false,
    url: urls[0],
    eventId,
  }

  await admin
    .firestore()
    .collection('bookSubmissions')
    .doc(bookId)
    .set(submission)
  console.log(filePath, bookId, submission)
})
