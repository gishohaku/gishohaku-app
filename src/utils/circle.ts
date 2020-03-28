import { EventId } from './event'

const categories1 = {
  'software/frontend': 'ソフトウェア／フロントエンド',
  'software/backend': 'ソフトウェア／バックエンド',
  'software/ml': 'ソフトウェア／機械学習・統計分析',
  'software/low-layer': 'ソフトウェア／ＯＳ・低レイヤ',
  'software/etc': 'ソフトウェア／その他',
  'infra/etc': 'インフラストラクチャ／その他',
  'hardware/iot': 'ハードウェア／ＩｏＴ',
  'hardware/etc': 'ハードウェア／その他',
  // 'etc/technology': 'その他／科学技術',
  'etc/technology': '科学技術',
  // 'etc/theory': 'その他／経営論・組織論・生存戦略',
  'etc/theory': '経営論・組織論・生存戦略',
  // 'etc/joint-book': 'その他／ノンジャンル技術合同誌',
  'etc/joint-book': 'ノンジャンル技術合同誌',
  // 'etc/etc': 'その他／その他',
  'etc/etc': 'その他',
}

const categories2 = {
  "IT-開発-IoT": "IT-開発-IoT",
  "IT-開発-Web": "IT-開発-Web",
  "IT-プログラミング-言語": "IT-プログラミング-言語",
  "IT-インフラ-サービス構築": "IT-インフラ-サービス構築",
  "理工系全般-その他-その他": "理工系全般-その他-その他",
  "IT-インフラ-ネットワーク": "IT-インフラ-ネットワーク",
  "IT-開発-OS/低レイヤ": "IT-開発-OS/低レイヤ",
  "理工系全般-理論・技術-工学系": "理工系全般-理論・技術-工学系",
  "IT-コンピュータサイエンス-情報学・情報科学": "IT-コンピュータサイエンス-情報学・情報科学",
  "理工系全般-その他-コミュニティ": "理工系全般-その他-コミュニティ",
  "IT-プログラミング-アーキテクチャ": "IT-プログラミング-アーキテクチャ",
  "IT-PC-全般": "IT-PC-全般",
  "IT-開発-ミドルウェア": "IT-開発-ミドルウェア",
  "IT-デザイン-UI": "IT-デザイン-UI",
  "IT-開発-ゲーム": "IT-開発-ゲーム",
  "理工系全般-組織-人材管理": "理工系全般-組織-人材管理",
  "IT-ハードウェア-ハードウェア開発": "IT-ハードウェア-ハードウェア開発",
  "IT-インフラ-IaaS": "IT-インフラ-IaaS",
  "理工系全般-理論・技術-理学系": "理工系全般-理論・技術-理学系",
  "理工系全般-ハードウェア-同人ハード": "理工系全般-ハードウェア-同人ハード",
  "IT-プログラミング-フレームワーク": "IT-プログラミング-フレームワーク",
  "IT-開発-データーベース": "IT-開発-データーベース",
  "IT-コンピュータサイエンス-セキュリティ": "IT-コンピュータサイエンス-セキュリティ",
  "理工系全般-組織-プロジェクト管理": "理工系全般-組織-プロジェクト管理",
  "IT-ハードウェア-アーキテクチャ": "IT-ハードウェア-アーキテクチャ",
  "理工系全般-組織-技術教育": "理工系全般-組織-技術教育",
  "IT-インフラ-ミドルウェア": "IT-インフラ-ミドルウェア",
  "理工系全般-ハードウェア-ハードウェア開発": "理工系全般-ハードウェア-ハードウェア開発",
  "IT-インフラ-サーバ・ネットワーク機器": "IT-インフラ-サーバ・ネットワーク機器",
  "理工系全般-その他-自己啓発": "理工系全般-その他-自己啓発",
  "IT-コンピュータサイエンス-人工知能・AI": "IT-コンピュータサイエンス-人工知能・AI",
  "理工系全般-科学・技術史-全般": "理工系全般-科学・技術史-全般",
  "IT-インフラ/サービス構築": "IT-インフラ/サービス構築"
}

export const categoriesByEvent = {
  gishohaku1: categories1,
  gishohaku2: categories2
}

export const plans = {
  'normal': '通常プラン',
  'premium': '倍量プラン'
}

export type CricleCategory = keyof typeof categories1 | keyof typeof categories2
export type CriclePlan = keyof typeof plans

export const allCategories: {
  [key in CricleCategory]: string
} = {
  ...categories1,
  ...categories2
}

export default interface Circle {
  id?: string
  space: string
  name: string
  nameKana: string
  image: string
  imageMonochro: string
  category: CricleCategory
  plan: CriclePlan
  twitter: string
  booth: string
  website: string
  eventId: EventId
}