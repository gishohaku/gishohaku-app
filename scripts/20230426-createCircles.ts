/**
 * command-line:
 * ts-node scripts/20230426-createCircles.ts
 */
import fs from 'fs'
import csv from 'csv-parser'
import admin from 'firebase-admin'
import Circle from '../app/src/utils/circle'

admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
});

const results: any[] = []
const categories = new Set()

fs.createReadStream('./data/entries-gishohaku8.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    const db = admin.firestore()
    results.filter(r => r.サークル名 !== '').map(async (result) => {
      const { サークル番号, サークル名, サークル名カナ, サークルジャンル } = result
      categories.add(サークルジャンル)

      const circle: Circle = {
        name: サークル名,
        nameKana: サークル名カナ,
        space: '',
        description: '',
        image: '',
        imageMonochro: '',
        category: サークルジャンル,
        plan: 'normal',
        twitter: '',
        booth: サークル番号,
        website: '',
        eventId: 'gishohaku8',
      }

      const res = await db.collection('circles').add(circle)
      console.log(res.id)
      return circle
    })

    // update category
    // const query = await db.collection('circles').where("eventId", "==", "gishohaku2").get()
    // query.docs.forEach(async (doc) => {
    //   const { name } = doc.data()
    //   const circle = circles.find(circle => circle.name === name)
    //   if (circle) {
    //     await doc.ref.update({
    //       category: circle.category
    //     })
    //   }
    // })
  });
