/**
 * command-line:
 * npx tsx scripts/20260823-createCircles.ts
 */
import fs from 'fs'
import csv from 'csv-parser'
import admin from 'firebase-admin'
import Circle from '../app/src/utils/circle'

// DryRun(既定 true): Firestore への書き込みは行わず、追加予定の内容をログ出力するだけ。
// 実際に書き込むときのみ環境変数 DRY_RUN=false を明示的に指定する。
// 例) DRY_RUN=false npx tsx scripts/20260823-createCircles.ts
const DRY_RUN = process.env.DRY_RUN !== 'false'
console.log(
  DRY_RUN
    ? '[DRY-RUN] Firestore へは書き込みません(追加予定をログ出力)。実書き込みは DRY_RUN=false を指定してください。'
    : '[実行] DRY_RUN=false のため実際に Firestore へ書き込みます。',
)

admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
});

const results: any[] = []
const categories = new Set()

fs.createReadStream('./data/entries-gishohaku14.csv')
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
        eventId: 'gishohaku14',
      }

      if (DRY_RUN) {
        console.log('[DRY-RUN] 追加予定:', circle.booth, circle.name)
      } else {
        const res = await db.collection('circles').add(circle)
        console.log(res.id)
      }
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
