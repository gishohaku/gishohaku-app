import admin from 'firebase-admin'

admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
});

const data: {
  booth: string
  name: string
}[] = [
    {
      "booth": "2F-あ01",
      "name": "株式会社grasys"
    },
    {
      "booth": "2F-あ02",
      "name": "さくらインターネット株式会社"
    },
    {
      "booth": "2F-あ03",
      "name": "株式会社虎の穴"
    },
    {
      "booth": "2F-あ04",
      "name": "全日本キャリア教育改善推進協会＆教育心理学を学ぶ会"
    },
    {
      "booth": "2F-あ05",
      "name": "Auth屋"
    },
    {
      "booth": "2F-あ06",
      "name": "親方project"
    },
    {
      "booth": "2F-あ07",
      "name": "湊川あいの、わかば家。"
    },
    {
      "booth": "2F-い01",
      "name": "EZ-NET"
    },
    {
      "booth": "2F-い02",
      "name": "Swift／Kotlin愛好会"
    },
    {
      "booth": "2F-う01",
      "name": "うさぎてっく"
    },
    {
      "booth": "2F-う02",
      "name": "@shu223"
    },
    {
      "booth": "2F-う03",
      "name": "Personal Factory"
    },
    {
      "booth": "2F-う04",
      "name": "Just1factory"
    },
    {
      "booth": "2F-う05",
      "name": "たみーくる"
    },
    {
      "booth": "2F-う06",
      "name": "ながら工房"
    },
    {
      "booth": "2F-え01",
      "name": "しおだいふく"
    },
    {
      "booth": "2F-え02",
      "name": "tenteroring project"
    },
    {
      "booth": "2F-え03",
      "name": "ssmjp同人部"
    },
    {
      "booth": "2F-え04",
      "name": "めもおきば"
    },
    {
      "booth": "2F-え05",
      "name": "Fluorite"
    },
    {
      "booth": "2F-え06",
      "name": "抹茶技庵"
    },
    {
      "booth": "2F-お01",
      "name": "貴とみーつ"
    },
    {
      "booth": "2F-お02",
      "name": "すらりんラボ"
    },
    {
      "booth": "2F-お03",
      "name": "浜風もっこす"
    },
    {
      "booth": "2F-お04",
      "name": "ノラカン"
    },
    {
      "booth": "2F-お05",
      "name": "SCHEMANEKO"
    },
    {
      "booth": "2F-か01",
      "name": "Everlasting Diary"
    },
    {
      "booth": "2F-か02",
      "name": "電脳世界"
    },
    {
      "booth": "2F-か03",
      "name": "第7開発セクション"
    },
    {
      "booth": "2F-か04",
      "name": "良能技研"
    },
    {
      "booth": "2F-か05",
      "name": "ブライトシステム"
    },
    {
      "booth": "2F-か06",
      "name": "Blowing"
    },
    {
      "booth": "2F-き01",
      "name": "東京ラビットハウス"
    },
    {
      "booth": "2F-き02",
      "name": "SOZO人(ZINE)"
    },
    {
      "booth": "2F-き03",
      "name": "kuluna.class"
    },
    {
      "booth": "2F-き04",
      "name": "脆弱性診断研究会"
    },
    {
      "booth": "2F-き05",
      "name": "C-treeLab."
    },
    {
      "booth": "2F-き06",
      "name": "ふぃーるどのーつ"
    },
    {
      "booth": "2F-く01",
      "name": "nekoze-at.tokyo"
    },
    {
      "booth": "2F-く02",
      "name": "Heriet"
    },
    {
      "booth": "2F-く03",
      "name": "モウフカブール"
    },
    {
      "booth": "2F-く04",
      "name": "umitsuki"
    },
    {
      "booth": "2F-け01",
      "name": "エモist出版"
    },
    {
      "booth": "2F-け02",
      "name": "SIGNIA"
    },
    {
      "booth": "2F-け03",
      "name": "まぐろのみぞおち"
    },
    {
      "booth": "2F-こ02",
      "name": "TeamJ"
    },
    {
      "booth": "2F-こ03",
      "name": "プロジェクトマネージャ保護者会"
    },
    {
      "booth": "2F-こ04",
      "name": "土田ゲーム技研"
    },
    {
      "booth": "2F-こ05",
      "name": "NPO法人IGDA日本"
    },
    {
      "booth": "2F-こ06",
      "name": "ゲームクリエイター育成会議"
    },
    {
      "booth": "2F-こ07",
      "name": "未来革新的情報工学研究所"
    },
    {
      "booth": "2F-こ08",
      "name": "ああ、月間150時間も働けば十分"
    },
    {
      "booth": "2F-こ09",
      "name": "わいわいテック"
    },
    {
      "booth": "3F-さ01",
      "name": "味噌とんトロ定食"
    },
    {
      "booth": "3F-さ02",
      "name": "yagitch.com"
    },
    {
      "booth": "3F-さ03",
      "name": "aNo研"
    },
    {
      "booth": "3F-さ04",
      "name": "お台場計算尺"
    },
    {
      "booth": "3F-さ05",
      "name": "ごまなつプロジェクト"
    },
    {
      "booth": "3F-さ06",
      "name": "Tec-Nomad"
    },
    {
      "booth": "3F-さ07",
      "name": "にっこりさわやかファクトリー"
    },
    {
      "booth": "3F-さ08",
      "name": "kinnekoの薄い本屋"
    },
    {
      "booth": "3F-し01",
      "name": "温泉♨BBA"
    },
    {
      "booth": "3F-し02",
      "name": "加藤家の食卓"
    },
    {
      "booth": "3F-し03",
      "name": "はにらぼ"
    },
    {
      "booth": "3F-し04",
      "name": "Shinko Lab."
    },
    {
      "booth": "3F-し05",
      "name": "松井工務店"
    },
    {
      "booth": "3F-し06",
      "name": "じがへるつ工房"
    },
    {
      "booth": "3F-し07",
      "name": "馬場研究所"
    },
    {
      "booth": "3F-し08",
      "name": "きじのしっぽ"
    },
    {
      "booth": "3F-す01",
      "name": "シン・オブジェクト倶楽部"
    },
    {
      "booth": "3F-す02",
      "name": "galaxy-sixth-sensey"
    },
    {
      "booth": "3F-す03",
      "name": "GetFEM++"
    },
    {
      "booth": "3F-す04",
      "name": "きつねこ"
    },
    {
      "booth": "3F-す05",
      "name": "Math Relish"
    },
    {
      "booth": "3F-す06",
      "name": "へにゃぺんて"
    },
    {
      "booth": "3F-す07",
      "name": "うたたね"
    },
    {
      "booth": "3F-す08",
      "name": "あきばよめ"
    },
    {
      "booth": "3F-せ01",
      "name": "いもあらい。"
    },
    {
      "booth": "3F-せ02",
      "name": "LAYER:03"
    },
    {
      "booth": "3F-せ03",
      "name": "らいがし式"
    },
    {
      "booth": "3F-せ04",
      "name": "みどりでぃんでぃん"
    },
    {
      "booth": "3F-せ05",
      "name": "とこしえ工房"
    },
    {
      "booth": "3F-せ06",
      "name": "テスターちゃん"
    },
    {
      "booth": "3F-そ01",
      "name": "音引屋"
    },
    {
      "booth": "3F-そ02",
      "name": "IM@Study"
    },
    {
      "booth": "3F-そ03",
      "name": "軍事学習社"
    },
    {
      "booth": "3F-そ04",
      "name": "mystt"
    },
    {
      "booth": "3F-そ05",
      "name": "るてんのお部屋"
    },
    {
      "booth": "3F-た01",
      "name": "聖地会議"
    },
    {
      "booth": "3F-た02",
      "name": "MERY Engineer Team"
    },
    {
      "booth": "3F-た03",
      "name": "インターステラ株式会社出版部"
    },
    {
      "booth": "3F-た04",
      "name": "アンテナハウスCAS電子出版"
    },
    {
      "booth": "3F-た05",
      "name": "株式会社HHM"
    },
    {
      "booth": "3F-た06",
      "name": "増井技術士事務所"
    },
    {
      "booth": "3F-た07",
      "name": "翔泳社"
    }
  ];

// TODO: 企業サークルデータ突っ込んだらもう一回実行する
(async () => {
  const db = admin.firestore()

  const circleSS = await db
    .collection('circles')
    .where('eventId', '==', 'gishohaku2')
    .get()

  data.forEach((circle, index) => {
    const circleDoc = circleSS.docs.find(doc => {
      return doc.data().name === circle.name
    })
    console.log(circle.booth, circleDoc && circleDoc.id)

    if (circleDoc) {
      circleDoc.ref.update({
        boothNumber: index + 1,
        booth: circle.booth,
      })
    }
  })
})()
