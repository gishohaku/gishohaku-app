
import firebase from 'firebase/app'
import 'firebase/firestore'

interface Book {
  circleRef: any
}

const main = async () => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      databaseURL: process.env.DATABASE_URL
    })
  }
  const db = firebase.firestore()
  // const bookSnapshots = await db.collection('books').doc('0x4IiVLjUuUyqjfgtoXT').get()
  // const data = bookSnapshots.data() as Book
  // console.log(refToPath(data, 'circleRef'))

  await db.collection('circles').add({
    name: 'つのぶえ出版'
  })
  // const data = bookSnapshots.data() as Book


}

function refToPath<T, U extends keyof T> (docData: T, pathField: U ) {
  const refField : any = docData[pathField]
  const pathSegments = refField._key.path.segments
  const fieldId = pathSegments[pathSegments.length - 1]
  return {
    ...docData,
    [pathField]: fieldId
  }
}

main()


