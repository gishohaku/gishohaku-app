import fs from 'fs'
import csv from 'csv-parser'
import admin from 'firebase-admin'
import Circle from '../app/utils/circle'
import { firestore } from 'firebase-functions';

admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
});

const results = []
const categories = new Set()

fs.createReadStream('./data/entries.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    const db = admin.firestore()
    const circles = results.filter(r => r.サークル名 !== '').map(async (result, index) => {
      const { サークル名, サークル名カナ, サークルジャンル, 申込プラン } = result
      categories.add(サークルジャンル)

      const circle: Circle = {
        name: サークル名,
        nameKana: サークル名カナ,
        image: '',
        imageMonochro: '',
        category: サークルジャンル,
        plan: 申込プラン === 'ゆったりプラン' ? 'premium' : 'normal',
        twitter: '',
        booth: '',
        website: '',
        eventId: 'gishohaku2',
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
