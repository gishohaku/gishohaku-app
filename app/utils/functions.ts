import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { refToPath } from './firebase'
import Book from './book'
import Circle from './circle'

export const perBookCount = 5

export const getBooks = async (options: { startAfter?: any }) => {
  const db: firebase.firestore.Firestore = firebase.firestore()
  let query = db
    .collection('books')
    .orderBy('updatedAt', 'desc')
    .limit(perBookCount)
  if (options.startAfter) {
    query = query.startAfter(options.startAfter)
  }
  const snapshots = await query.get()
  const results: Book[] = []
  snapshots.forEach(snapshot => {
    const { circleRef, ...original } = snapshot.data()
    const data = {
      ...original,
      circle: refToPath(original.circle, 'ref')
    }
    results.push({
      id: snapshot.id,
      ...(data as Book)
    })
  })
  return results

  // TODO: ある程度データが入力されたらキャッシュを利用したFunctionsに差し替える
  const result = await axios.get('https://us-central1-gishohaku.cloudfunctions.net/apiBooks')
  return result.data
}

export const getCircles = async () => {
  // const db: firebase.firestore.Firestore = firebase.firestore()
  // const snapshots = await db
  //   .collection('circles')
  //   .orderBy('boothNumber', 'asc')
  //   .get()
  // const results: Circle[] = []
  // snapshots.forEach(snapshot => {
  //   results.push({
  //     id: snapshot.id,
  //     ...(snapshot.data() as Circle)
  //   })
  // })
  // return results

  // TODO: ある程度データが入力されたらキャッシュを利用したFunctionsに差し替える
  const result = await axios.get('https://us-central1-gishohaku.cloudfunctions.net/apiCircles')
  return result.data as Circle[]
}
