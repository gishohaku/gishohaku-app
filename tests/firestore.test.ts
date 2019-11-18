// https://github.com/firebase/quickstart-nodejs/tree/master/firestore-emulator/typescript-quickstart

import * as firebase from "@firebase/testing";
import * as fs from "fs";

const projectId = "gishohaku";
const rules = fs.readFileSync("firestore.rules", "utf8");

const authedApp = (auth) => {
  return firebase
    .initializeTestApp({ projectId, auth })
    .firestore();
}

const admin = firebase.initializeAdminApp({ projectId })
const adminDb = admin.firestore()

beforeAll(async () => {
  await firebase.loadFirestoreRules({ projectId, rules })

  await adminDb.collection('circles').doc('my-circle').set({
    eventId: 'gishohaku2'
  })
})

afterAll(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()));
})

describe('basic test', () => {
  it('has initial data', async () => {
    const db = authedApp(null)
    const query = await db.collection("circles").get()
    expect(query.docs.length).toBe(1)
  })

  it('create basic user', async () => {
    const db = authedApp({ uid: 'taro' })
    const doc = db.collection('users').doc('taro')
    await firebase.assertSucceeds(
      doc.set({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        displayName: 'taro',
        email: 'taro@example.com',
        photoURL: ''
      })
    )
  })
})

describe('circle user', () => {
  beforeAll(async () => {
    const doc = adminDb.collection('users').doc('taro')
    const circleRef = adminDb.collection('circles').doc('my-circle')
    await doc.set({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      displayName: 'taro',
      email: 'taro@example.com',
      photoURL: '',
      event: {
        gishohaku2: circleRef
      }
    })
  })

  it('create book', async () => {
    const db = authedApp({ uid: 'taro' })

    const doc = db.collection('books').doc('awesome-book')
    const circleRef = db.collection('circles').doc('my-circle')
    await firebase.assertSucceeds(doc.set({
      eventId: 'gishohaku2',
      circle: {
        ref: circleRef
      }
    }))

    const query = await db.collection('books').get()
    expect(query.docs.length).toBe(1)
  })
})