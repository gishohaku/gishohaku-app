export const categories = {
  'software/frontend': 'ソフトウェア／フロントエンド',
  'software/backend': 'ソフトウェア／バックエンド',
  'software/ml': 'ソフトウェア／機械学習・統計分析',
  'software/low-layer': 'ソフトウェア／ＯＳ・低レイヤ',
  'software/etc': 'ソフトウェア／その他',
  'infra': 'インフラストラクチャ',
  'hardware': 'ハードウェア',
  'etc/technology': 'その他／科学技術',
  'etc/theory': 'その他／経営論・組織論・生存戦略',
  'etc/joint-book': 'その他／ノンジャンル技術合同誌',
  'etc/etc': 'その他／その他',
}

export const plans = {
  'normal': '通常プラン',
  'premium': '倍量プラン'
}

export type CricleCategory = keyof typeof categories
export type CriclePlan = keyof typeof plans

export default interface Circle {
  id?: string
  space: string
  name: string
  nameKana: string
  image: string
  category: CricleCategory
  plan: CriclePlan
  twitter: string
  booth: string
  website: string
}