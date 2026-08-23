/**
 * command-line:
 * npx tsx scripts/20260823-createInvitation.ts
 */
import admin from 'firebase-admin'

// DryRun(既定 true): circleInvitations への書き込みは行わず、作成予定をログ出力するだけ。
// 実際に書き込むときのみ環境変数 DRY_RUN=false を明示的に指定する。
// 例) DRY_RUN=false npx tsx scripts/20260823-createInvitation.ts
// ※ サークル一覧の読み取り(get)は DB を変更しないため DryRun でも実行する。
const DRY_RUN = process.env.DRY_RUN !== 'false'
console.log(
  DRY_RUN
    ? '[DRY-RUN] circleInvitations へは書き込みません(作成予定をログ出力)。実書き込みは DRY_RUN=false を指定してください。'
    : '[実行] DRY_RUN=false のため実際に circleInvitations を作成します。',
)

admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
});

(async () => {
  const db = admin.firestore()
  const query = db.collection('circles').where("eventId", "==", "gishohaku14")
  const snapshot = await query.get()
  snapshot.docs.forEach(async doc => {
    const { name, booth } = doc.data()
    // console.log(doc.id, name)
    if (DRY_RUN) {
      console.log(
        '[DRY-RUN] 招待作成予定:',
        [doc.id, booth, name].join(', '),
      )
      return
    }
    const result = await doc.ref.collection('circleInvitations').add({
      eventId: "gishohaku14"
    })
    const token = result.id
    console.log([
      doc.id,
      booth,
      name,
      token,
      `https://gishohaku.dev/gishohaku14/mypage/join?circleId=${doc.id}&token=${token}`
    ].join(", "))
  })
})()