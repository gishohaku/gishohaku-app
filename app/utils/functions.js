import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { refToPath } from './firebase'

export const getBooks = async () => {
  const db = firebase.firestore()
  const snapshots = await db.collection('books').get()
  const results = []
  snapshots.forEach(snapshot => {
    const data = refToPath(snapshot.data(), 'circleRef')
    results.push({
      id: snapshot.id,
      ...data
    })
  })
  return results

  // TODO: ある程度データが入力されたらキャッシュを利用したFunctionsに差し替える
  const result = await axios.get('https://us-central1-gishohaku.cloudfunctions.net/apiBooks')
  return result.data
}

export const getCircles = async () => {
  const db = firebase.firestore()
  const snapshots = await db.collection('circles').get()
  const results = []
  snapshots.forEach(snapshot => {
    results.push({
      id: snapshot.id,
      ...snapshot.data()
    })
  })
  return results

  // TODO: ある程度データが入力されたらキャッシュを利用したFunctionsに差し替える
  const result = await axios.get('https://us-central1-gishohaku.cloudfunctions.net/apiCircles')
  return result.data
}
