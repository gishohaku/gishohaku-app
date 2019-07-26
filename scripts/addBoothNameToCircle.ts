const admin = require('firebase-admin')
// import firebase from 'firebase'

admin.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
})

const circleData = [
  ['A-1', 'aNo研'],
  ['A-2', 'きじのしっぽ'],
  ['A-3', 'MZ工房'],
  ['A-4', 'これなりハウス'],
  ['A-5', 'お台場計算尺'],
  ['A-6', 'あいらぶ量子コンピューター'],
  ['A-7', 'のらかん'],
  ['A-8', '電脳律速'],
  ['A-9', 'AQUAXIS'],
  ['A-12', '槌田ゲーム技研'],
  ['A-13', '浜風もっこす'],
  ['A-14', '減量同好会'],
  ['A-15', 'アイシステック'],
  ['A-16', 'まぐろのみぞおち'],
  ['A-17', 'アンテナハウスCAS電子出版'],
  ['A-18', 'イカも競技も下手くそ'],
  ['A-19', 'kuluna.class'],
  ['A-20', '杜の都の開発室'],
  ['B-1', 'MERY Engineer Team'],
  ['B-2', 'ダックタイピング'],
  ['B-3', 'umituki'],
  ['B-4', 'Heriet'],
  ['B-5', 'Dodgson Labs'],
  ['B-6', 'nekoze-at.tokyo'],
  ['B-7', 'Beer-2.0'],
  ['B-8', 'SHEMANEKO'],
  ['B-9', 'POStudy～アジャイル・プロダクトマネジメント研究会～'],
  ['B-11', 'プロジェクトマネージャー保護者会'],
  ['B-13', 'Owl eng.'],
  ['B-14', 'grwothfaction'],
  ['B-15', 'エンジニアの登壇を応援する会'],
  ['B-16', 'yagitdi.com'],
  ['B-17', 'ながら工房'],
  ['B-18', 'clear-mint'],
  ['B-19', '整地会議'],
  ['C-1', 'テスターちゃん'],
  ['C-3', 'にっこりさわやかファクトリー'],
  ['C-4', 'JSTQB  Advanced Level 試験対策勉強会'],
  ['C-5', 'JET Mets'],
  ['C-6', '落雷スプライト'],
  ['C-7', 'このづみ堂'],
  ['C-8', 'SIGNA'],
  ['C-9', 'ssmjp同人部'],
  ['C-10', 'めもおきば'],
  ['C-11', '道端の鳩'],
  ['C-12', '貴とみーつ'],
  ['C-13', 'Parasuicide'],
  ['C-14', 'モウフカプール'],
  ['C-15', 'はなごよみ'],
  ['C-16', 'EZ-NET'],
  ['C-17', 'kinnekoの薄い本屋'],
  ['C-18', '増井技術士事務所'],
  ['C-19', '@shu223'],
  ['D-1', '東京ラビットハウス'],
  ['D-2', 'ふぃーるどのーつ'],
  ['D-3', 'くるみ割り書房'],
  ['D-4', 'つのぶえ出版'],
  ['D-5', 'feb19'],
  ['D-6', 'cat /dev/null'],
  ['D-7', 'ハムかつおじさん'],
  ['D-8', 'yoneda.js'],
  ['D-9', 'Tech The Toaster'],
  ['D-10', 'Just1factory'],
  ['E-1', '湊川あいの、わかば家。'],
  ['E-3', '水晶雫世界'],
  ['E-5', '親方Project'],
  ['E-7', 'whiims'],
  ['E-9', 'とらのあな']
]

const db = admin.firestore()
const main = async () => {
  for (let i = 0; i < circleData.length; i++) {
    const [boothName, circleName] = circleData[i]
    const snapshot = await db
      .collection('circles')
      .where('name', '==', circleName)
      .get()
    if (!snapshot.empty) {
      console.log('[START] ', boothName, circleName, snapshot.size)
      for (let j = 0; j < snapshot.size; j++) {
        console.log(boothName, circleName, snapshot.docs[0].id, snapshot.size)
        await db
          .collection('circles')
          .doc(snapshot.docs[0].id)
          .set(
            {
              booth: boothName,
              boothNumber: i + 1
            },
            {
              merge: true
            }
          )
      }
    }
  }
}

// 確認用
// const main = async () => {
//   const circles = await db.collection('circles').get()
//   circles.forEach(circle => {
//     const circleData = {
//       ...circle.data(),
//       id: circle.id
//     }
//     console.log(
//       circleData.booth || '[BLANK]',
//       circleData.boothNumber,
//       circleData.id,
//       circleData.name
//     )
//     if (!circleData.boothNumber) {
//       db.collection
//     }
//   })
// }

main()
