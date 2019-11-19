import axios from 'axios'
import Book, { refToId } from './book'
import Circle from './circle'
import { db } from './firebase'
import { EventId } from './event'

export const perBookCount = 5

export const getBooks = async (eventId: EventId, options: { startAfter?: any }) => {
  let query = db
    .collection('books')
    .where('eventId', '==', eventId)
    .orderBy('updatedAt', 'desc')
    .limit(perBookCount)
  if (options.startAfter) {
    query = query.startAfter(options.startAfter)
  }
  const snapshots = await query.get()
  const results: Book[] = []
  snapshots.forEach(snapshot => {
    const data = snapshot.data() as Book
    const book = refToId(data)
    results.push({
      id: snapshot.id,
      ...book,
    })
  })
  return results

  // TODO: ある程度データが入力されたらキャッシュを利用したFunctionsに差し替える
  const result = await axios.get('https://us-central1-gishohaku.cloudfunctions.net/apiBooks')
  return result.data
}

export const getCircles = async (eventId: EventId) => {
  const snapshots = await db
    .collection('circles')
    .where('eventId', '==', eventId)
    .orderBy('boothNumber', 'asc')
    .get()
  const results: Circle[] = []
  snapshots.forEach(snapshot => {
    results.push({
      id: snapshot.id,
      ...(snapshot.data() as Circle)
    })
  })
  return results

  // TODO: ある程度データが入力されたらキャッシュを利用したFunctionsに差し替える
  const result = await axios.get('https://us-central1-gishohaku.cloudfunctions.net/apiCircles')
  return result.data as Circle[]
}
