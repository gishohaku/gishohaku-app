import admin from 'firebase-admin'
import dayjs from 'dayjs'
import mysql from 'mysql'

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3312,
  user: 'root',
  password: '',
  database: 'gishohaku'
})

admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
})

const db = admin.firestore()

const main = async () => {
  connection.connect()

  const bSnapshots = await db.collection('books').get()
  bSnapshots.docs
    .map(doc => {
      const data = doc.data()
      const createdAt = dayjs((data.createdAt || data.updatedAt).seconds * 1000).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      const updatedAt = dayjs(data.updatedAt.seconds * 1000).format('YYYY-MM-DD HH:mm:ss')
      return {
        id: doc.id,
        title: data.title,
        circleId: data.circleRef.id,
        createdAt,
        updatedAt
      }
    })
    .forEach(({ id, title, circleId, createdAt, updatedAt }) => {
      const query = `INSERT INTO books(fs_id, title, circle_id, created_at, updated_at)
      VALUES ('${id}', '${title}', '${circleId}', '${createdAt}', '${updatedAt}')`
      console.log(query)
      connection.query(query, (error, results, fields) => {
        console.log(error, results, fields)
      })
    })

  // const cSnapshots = await db
  //   .collection('circles')
  //   .orderBy('boothNumber', 'asc')
  //   .get()
  // cSnapshots.docs
  //   .map(doc => {
  //     const data = doc.data()
  //     const createdAt = dayjs(data.createdAt.seconds * 1000).format('YYYY-MM-DD HH:mm:ss')
  //     return {
  //       id: doc.id,
  //       name: data.name,
  //       booth: data.booth,
  //       boothNumber: data.boothNumber,
  //       createdAt
  //     }
  //   })
  //   .forEach(({ id, name, booth, boothNumber, createdAt }) => {
  //     const query = `INSERT INTO circles(fs_id, name, booth, booth_number, created_at, updated_at)
  //     VALUES ('${id}', '${name}', '${booth}', '${boothNumber}', '${createdAt}', '${createdAt}')`
  //     console.log(query)
  //     connection.query(query, (error, results, fields) => {
  //       console.log(error, results, fields)
  //     })
  //   })

  // const bsSnapshots = await db.collectionGroup('bookStars').get()
  // bsSnapshots.docs
  //   .map(doc => {
  //     const data = doc.data()
  //     const createdAt = dayjs(data.createdAt.seconds * 1000).format('YYYY-MM-DD HH:mm:ss')
  //     const [users, userId, bookStars, id] = doc.ref.path.split('/')
  //     return {
  //       bookId: id,
  //       userId: userId,
  //       createdAt
  //     }
  //   })
  //   .forEach(({ bookId, userId, createdAt }) => {
  //     const query = `INSERT INTO book_stars(fs_id, book_id, user_id, created_at, updated_at)
  //     VALUES ('${bookId}', '${bookId}', '${userId}', '${createdAt}', '${createdAt}')`
  //     connection.query(query, (error, results, fields) => {
  //       console.log(error, results, fields)
  //     })
  //   })

  // const csSnapshots = await db.collectionGroup('circleStars').get()
  // csSnapshots.docs
  //   .map(doc => {
  //     const data = doc.data()
  //     const createdAt = dayjs(data.createdAt.seconds * 1000).format('YYYY-MM-DD HH:mm:ss')
  //     const [users, userId, circleStars, id] = doc.ref.path.split('/')
  //     return {
  //       circleId: id,
  //       userId: userId,
  //       createdAt
  //     }
  //   })
  //   .forEach(({ circleId, userId, createdAt }) => {
  //     const query = `INSERT INTO circle_stars(fs_id, circle_id, user_id, created_at, updated_at)
  //     VALUES ('${circleId}', '${circleId}', '${userId}', '${createdAt}', '${createdAt}')`
  //     connection.query(query, (error, results, fields) => {
  //       console.log(error, results, fields)
  //     })
  //   })

  connection.end()
}

main()
