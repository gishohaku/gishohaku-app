/** @jsx jsx */
import { Select, IconButton, IconChevronLeft, IconChevronRight } from 'sancho'
import { useRouter } from 'next/router'
import { jsx, css } from '@emotion/core'
import { useCallback, useContext } from 'react'
import EventContext from '../contexts/EventContext'

interface Props {
  circleId: string
  starIds: string[]
}

// TODO: イベント終わったら静的ファイル化して外に出す
const gishohaku1Circles = [
  { id: 'GZbC0MSg0OKK9S4FcplO', name: 'aNo研', booth: 'A-1' },
  { id: 'kYULXovSWzu8GSThev87', name: 'きじのしっぽ', booth: 'A-2' },
  { id: 'JaxqUYEGAE3HLqxiHvgS', name: 'MZ工房', booth: 'A-3' },
  { id: 'aareCSVXghoyNp6lTFkr', name: 'これなりハウス', booth: 'A-4' },
  { id: '6gNqzVdWmcyVi26cdrX3', name: 'お台場計算尺', booth: 'A-5' },
  {
    id: '1kGxUoK2Q19qZ5ad7Hrw',
    name: 'あいらぶ量子コンピュータ',
    booth: 'A-6',
  },
  { id: 'G8HNOcdtXUgrx16uMYKk', name: 'ノラカン', booth: 'A-7' },
  { id: 'lJHQJW0VhaVcY6Mgc5yH', name: '電脳律速', booth: 'A-8' },
  { id: 'M7OhEuDTyS0yXQd8lNuB', name: 'AQUAXIS', booth: 'A-9' },
  { id: 'NYfZooVMfGzuCS40qUlx', name: '土田ゲーム技研', booth: 'A-12' },
  { id: 'asCbUGqYbX8ksLDpVShj', name: '浜風もっこす', booth: 'A-13' },
  { id: 'rqHwmhJ0veS2oeaKp4Mi', name: '減量同好会', booth: 'A-14' },
  { id: 'ZI4O9rMClPtcGcHdSoYS', name: 'まぐろのみぞおち', booth: 'A-16' },
  {
    id: '3m0d5xAHgsRwf35DvJhG',
    name: 'アンテナハウスCAS電子出版',
    booth: 'A-17',
  },
  { id: 'FjoGG8Tx5OE2meIKacwa', name: 'イカも競技も下手くそ', booth: 'A-18' },
  {
    id: 'byjsr8nhaQY30s0Nkhw8',
    name: 'kuluna.class',
    booth: 'A-19',
  },
  { id: 'GSOOquYqzcs7lRMIyLOo', name: '杜の都の開発室', booth: 'A-20' },
  {
    id: '15SWB19UpPFmEbMoxwuK',
    name: 'MERY Engineer Team',
    booth: 'B-1',
  },
  { id: '92TDvTqSyA9I7jnDSACP', name: 'ダックタイピング', booth: 'B-2' },
  { id: '7nAGEPa9Rl9UBnfQRs0e', name: 'umitsuki', booth: 'B-3' },
  { id: 'B7Qcb4Y6iJLL3FCZWKKL', name: 'Heriet', booth: 'B-4' },
  {
    id: '9DJu2nvhnTaZWZkJ0WJU',
    name: 'Dodgson Labs',
    booth: 'B-5',
  },
  {
    id: 'W6HJiybmJ1umQaX9BQlF',
    name: 'nekoze-at.tokyo',
    booth: 'B-6',
  },
  { id: 'NNt0IdDL6L5oc1hoY64g', name: 'Beer2.0', booth: 'B-7' },
  { id: 'O3Jq5pDWtDoRcbtJF7G2', name: 'SCHEMANEKO', booth: 'B-8' },
  {
    id: 'OPavvEWyFywTJu9i1ZmF',
    name: 'POStudy 〜アジャイル・プロダクトマネジメント研究会〜',
    booth: 'B-9',
  },
  {
    id: 'g3a3lYbXcroP8rL3HB67',
    name: 'プロジェクトマネージャ保護者会',
    booth: 'B-11',
  },
  { id: 'M0COaVwgZyvBztfafec5', name: 'Owl eng.', booth: 'B-13' },
  {
    id: '3Ywd2rxrLTZjD9344Svk',
    name: 'growthfaction',
    booth: 'B-14',
  },
  {
    id: 'WrqqMM9j4tsnrGxH3PpI',
    name: 'エンジニアの登壇を応援する会',
    booth: 'B-15',
  },
  {
    id: '77F8C9rw7iWgTQzdVbox',
    name: 'yagitch.com',
    booth: 'B-16',
  },
  { id: '7YWKN13FGsxpJUlVIip2', name: 'ながら工房', booth: 'B-17' },
  { id: '77awXL0Bmem3NED5OxPQ', name: 'clear-mint', booth: 'B-18' },
  { id: '4ImAN41mbw9P6mK05QoB', name: '聖地会議', booth: 'B-19' },
  { id: 'sL12d49gD1zUGnMDRyJz', name: 'テスターちゃん', booth: 'C-1' },
  {
    id: 'kD1DdAwDLpf4gFPubjer',
    name: 'にっこりさわやかファクトリー',
    booth: 'C-3',
  },
  {
    id: 'wrHyIUAvf8qWkhofcTK0',
    name: 'JSTQB Advanced Level 試験対策勉強会',
    booth: 'C-4',
  },
  { id: 'zAb1TZIr9IRpvN9Ip4p4', name: 'JetMets', booth: 'C-5' },
  { id: '10HwhTWvVfTb51UCKQ8v', name: 'なめこっと', booth: 'C-7' },
  { id: 'PaeywWBiDjpS4gkvkn5O', name: 'SIGNIA', booth: 'C-8' },
  { id: 'PeyOrElKh0V2P7eIANXr', name: 'ssmjp同人部', booth: 'C-9' },
  { id: 'TKKxUnxApWJJ94tpXiYY', name: 'めもおきば', booth: 'C-10' },
  { id: 'Kl1ANm87hoy285gte7az', name: '道端の鳩', booth: 'C-11' },
  { id: 'KqTVSC2LoAJVfXzRRlnc', name: '貴とみーつ', booth: 'C-12' },
  { id: '4jPJWjx8UuToD4oPzdBX', name: 'モウフカブール', booth: 'C-14' },
  { id: '5nkMEs7Hiw6bsqPFaI7w', name: 'はなごよみ', booth: 'C-15' },
  { id: '8JJZO4YWEowNxb60SN3e', name: 'EZ-NET', booth: 'C-16' },
  {
    id: '18dtiSZQ3mQbCRWTmKPQ',
    name: 'kinnekoの薄い本屋',
    booth: 'C-17',
  },
  { id: 'lkjEEqSVhXUSpgwlQcL0', name: '増井技術士事務所', booth: 'C-18' },
  { id: 'aau62qtbHzXb6RFs7y6l', name: '@shu223', booth: 'C-19' },
  { id: 'G575OcbxkbvhlBzX8Bu4', name: '東京ラビットハウス', booth: 'D-1' },
  { id: 'TvTjBloCyLHiojQ8ZTwm', name: 'ふぃーるどのーつ', booth: 'D-2' },
  { id: 'IQtnW2s3Ozp7y4j2oKbA', name: 'くるみ割り書房', booth: 'D-3' },
  { id: 'RkpAgwxKHvojVIrjlsqj', name: 'つのぶえ出版', booth: 'D-4' },
  { id: 'ZlxJgk5LuJPvmXxT5UVn', name: 'feb19', booth: 'D-5' },
  { id: 'rxpnQksPy3Hmiyy8Qpig', name: 'ハムカツおじさん🤘', booth: 'D-7' },
  { id: 'hxWQe1MCEfjyNb5qTxRD', name: 'yoneda.js', booth: 'D-8' },
  {
    id: 'WtKfU83xwNvLrmIE3SSP',
    name: 'Tech The Toaster',
    booth: 'D-9',
  },
  {
    id: 'yoiSxouJ2rxPuaeJGHMw',
    name: 'Just1factory',
    booth: 'D-10',
  },
  { id: 'LgpaWhufGMZWV79VVNYK', name: '湊川あいの、わかば家。', booth: 'E-1' },
  { id: 'smOKF9zaHnHPorgMA6lt', name: '水晶雫世界', booth: 'E-3' },
  { id: '0nsyABa1xIVSm3p8nhDq', name: '親方Project', booth: 'E-5' },
  { id: 'LfrDCc7IRO4VPA71nOzm', name: 'whiims', booth: 'E-7' },
  { id: 'bTx12XFa4xexGb1BRsbi', name: '虎の穴ラボ', booth: 'E-9' },
]

const gishohaku2Circles = [
  {
    id: 'ewVHOuRSc28ver7mdumA',
    name: '全日本キャリア教育改善推進協会＆教育心理学を学ぶ会',
    booth: '2F-あ04',
  },
  {
    id: 'LavDwnzLqolvGN80cehM',
    name: 'Auth屋',
    booth: '2F-あ05',
  },
  {
    id: 'tNbFjXDPvcDxk0Z672m5',
    name: '親方project',
    booth: '2F-あ06',
  },
  {
    id: 'xdY6CuYcXu1ZyPRrq2fF',
    name: '湊川あいの、わかば家。',
    booth: '2F-あ07',
  },
  {
    id: 'zKuT7jdYR3bL697OnXVf',
    name: 'EZ-NET',
    booth: '2F-い01',
  },
  {
    id: 'is0oF2nR9Ok7HkbSn5vz',
    name: 'Swift／Kotlin愛好会',
    booth: '2F-い02',
  },
  {
    id: 'Q7MUo5y1j3w00aniq2dC',
    name: 'うさぎてっく',
    booth: '2F-う01',
  },
  {
    id: 'TcThAqbcdxq7B4IBVbq7',
    name: '@shu223',
    booth: '2F-う02',
  },
  {
    id: 'CoRhV4iuTlm3n5yanrmO',
    name: 'Personal Factory',
    booth: '2F-う03',
  },
  {
    id: 'JKaBMCETGSv08PN3CT8b',
    name: 'Just1factory',
    booth: '2F-う04',
  },
  {
    id: '8TmWY4n26kKQVsakIuFZ',
    name: 'たみーくる',
    booth: '2F-う05',
  },
  {
    id: 'iwHySxhIFT5hSShn4OwU',
    name: 'ながら工房',
    booth: '2F-う06',
  },
  {
    id: 'aXmkZVvpbJBrNiODW12f',
    name: 'しおだいふく',
    booth: '2F-え01',
  },
  {
    id: 'Lzd1OA5nV7cSJNkrdHM0',
    name: 'tenteroring project',
    booth: '2F-え02',
  },
  {
    id: 'UaVdgq4F4kyBD3WwXeFF',
    name: 'ssmjp同人部',
    booth: '2F-え03',
  },
  {
    id: 'QwH2A6pR66Qo9O7fHX73',
    name: 'めもおきば',
    booth: '2F-え04',
  },
  {
    id: 'LcEtOQmxLPjpv2lTAFat',
    name: 'Fluorite',
    booth: '2F-え05',
  },
  {
    id: 'KxMfxVBGBtrHKBTS9334',
    name: '抹茶技庵',
    booth: '2F-え06',
  },
  {
    id: 'VL05TgiBBV54fn3f7c8Q',
    name: '貴とみーつ',
    booth: '2F-お01',
  },
  {
    id: 'panltIbJMQYssR5PkteP',
    name: 'すらりんラボ',
    booth: '2F-お02',
  },
  {
    id: '7lSLvE2SLskZ2zTc2SSI',
    name: '浜風もっこす',
    booth: '2F-お03',
  },
  {
    id: 'JPRZDkmpmrxS7dCzBYms',
    name: 'ノラカン',
    booth: '2F-お04',
  },
  {
    id: 'JffjMuiunS3pQUnzn6sZ',
    name: 'SCHEMANEKO',
    booth: '2F-お05',
  },
  {
    id: 'nklmjjWPhfT6oVdq4Upa',
    name: 'Everlasting Diary',
    booth: '2F-か01',
  },
  {
    id: 'KHOJMgExYsnetXb1PnpO',
    name: '電脳世界',
    booth: '2F-か02',
  },
  {
    id: 'XFeo9894qUB5aCE7b5RF',
    name: '第7開発セクション',
    booth: '2F-か03',
  },
  {
    id: 'tpQuUN1fQ5fJJ1tS7KA0',
    name: '良能技研',
    booth: '2F-か04',
  },
  {
    id: 'nuPpMhucCMtEF2380C7l',
    name: 'ブライトシステム',
    booth: '2F-か05',
  },
  {
    id: 'udMD2oRU9LD09fRuddqk',
    name: 'Blowing',
    booth: '2F-か06',
  },
  {
    id: '6ErbDMM3bgvrwexpQdHR',
    name: '東京ラビットハウス',
    booth: '2F-き01',
  },
  {
    id: 'ec8rd5mpYlatsbFalRbe',
    name: 'SOZO人(ZINE)',
    booth: '2F-き02',
  },
  {
    id: '9FD5uA12tFDolr0DbIWK',
    name: 'kuluna.class',
    booth: '2F-き03',
  },
  {
    id: 'QYSoItZmJFfh4I6Flzha',
    name: '脆弱性診断研究会',
    booth: '2F-き04',
  },
  {
    id: 'fbMxTv9SD2DkZcCyxk7r',
    name: 'C-treeLab.',
    booth: '2F-き05',
  },
  {
    id: 'bfJjYUK7wiN1CZaBfvSP',
    name: 'ふぃーるどのーつ',
    booth: '2F-き06',
  },
  {
    id: 'h236lq3ghXdDgi6OiVFb',
    name: 'nekoze-at.tokyo',
    booth: '2F-く01',
  },
  {
    id: 'gAiNroSwQnzxukCVxRpe',
    name: 'Heriet',
    booth: '2F-く02',
  },
  {
    id: 'THaZNU7RMRdc9AsRyWuF',
    name: 'モウフカブール',
    booth: '2F-く03',
  },
  {
    id: 'TzqGtOIUa4dmR1NYDHuB',
    name: 'umitsuki',
    booth: '2F-く04',
  },
  {
    id: '1VMONWTt5gVZGJxBrXQn',
    name: 'エモist出版',
    booth: '2F-け01',
  },
  {
    id: 'zaeWvl3fwrRDmgdhVu8q',
    name: 'SIGNIA',
    booth: '2F-け02',
  },
  {
    id: 'BKhQcRXFws2NG5jtwSLS',
    name: 'まぐろのみぞおち',
    booth: '2F-け03',
  },
  {
    id: 'l2JcqgjmuBTBTwzJveMQ',
    name: 'TeamJ',
    booth: '2F-こ02',
  },
  {
    id: 'NZHyodTF3Eea27FKE349',
    name: 'プロジェクトマネージャ保護者会',
    booth: '2F-こ03',
  },
  {
    id: 'TRTsYMMBbkWWQ8qwZzIk',
    name: '土田ゲーム技研',
    booth: '2F-こ04',
  },
  {
    id: 'wvN8ETW7flYYaLRic71I',
    name: 'NPO法人IGDA日本',
    booth: '2F-こ05',
  },
  {
    id: 'Q1E53HBIf5u7c1BcGyXp',
    name: 'ゲームクリエイター育成会議',
    booth: '2F-こ06',
  },
  {
    id: '36RJ5s43vv8LJCBpZ11h',
    name: '未来革新的情報工学研究所',
    booth: '2F-こ07',
  },
  {
    id: '1t9cOvzwH6LFZg3Lda1p',
    name: 'ああ、月間150時間も働けば十分',
    booth: '2F-こ08',
  },
  {
    id: 'HoeeTRoReBRDeSvzDi3a',
    name: 'わいわいテック',
    booth: '2F-こ09',
  },
  {
    id: 'hZebPoRaGg0y2micO0wQ',
    name: '味噌とんトロ定食',
    booth: '3F-さ01',
  },
  {
    id: 'OWNfBW7sbHG4lntlj2og',
    name: 'yagitch.com',
    booth: '3F-さ02',
  },
  {
    id: '3ZmINP7knOp5dz2hPHeJ',
    name: 'aNo研',
    booth: '3F-さ03',
  },
  {
    id: 'T8fIcVxKbFLirTDOrkKB',
    name: 'お台場計算尺',
    booth: '3F-さ04',
  },
  {
    id: 'j9Ej8freDaFH20o9RcvG',
    name: 'ごまなつプロジェクト',
    booth: '3F-さ05',
  },
  {
    id: 'jGXrzEgQsSrgPunfctCK',
    name: 'Tec-Nomad',
    booth: '3F-さ06',
  },
  {
    id: 'CgHBtsnN5wd314gCwdoy',
    name: 'にっこりさわやかファクトリー',
    booth: '3F-さ07',
  },
  {
    id: '3hjTjDsrA3lDu1DTz1QT',
    name: 'kinnekoの薄い本屋',
    booth: '3F-さ08',
  },
  {
    id: 'r4hHhaPtH0SvJfHwm6qs',
    name: '温泉♨BBA',
    booth: '3F-し01',
  },
  {
    id: '36GViNaLe73xVJ49bpLY',
    name: '加藤家の食卓',
    booth: '3F-し02',
  },
  {
    id: 'v9HYyrSxhlimlB6lAXAS',
    name: 'はにらぼ',
    booth: '3F-し03',
  },
  {
    id: 'xRXmmJqjxP79Q6fgyi0E',
    name: 'Shinko Lab.',
    booth: '3F-し04',
  },
  {
    id: 'ZlCJ4U2ENiX1SkVU7uWJ',
    name: '松井工務店',
    booth: '3F-し05',
  },
  {
    id: 'ueAeguW8YGPoSy9jTVef',
    name: 'じがへるつ工房',
    booth: '3F-し06',
  },
  {
    id: 'fU7FJ2F8obKESWa2IeWI',
    name: '馬場研究所',
    booth: '3F-し07',
  },
  {
    id: 'SMBZkS3ZfLh6F0zyLOCO',
    name: 'きじのしっぽ',
    booth: '3F-し08',
  },
  {
    id: 'dwJ4KCEdkWjxEqtg07hZ',
    name: 'シン・オブジェクト倶楽部',
    booth: '3F-す01',
  },
  {
    id: 'CX0TBAG1hrHme3eXZ6G6',
    name: 'galaxy-sixth-sensey',
    booth: '3F-す02',
  },
  {
    id: 'AuftwVakN9DffDx1Q9fe',
    name: 'GetFEM++',
    booth: '3F-す03',
  },
  {
    id: 'Plfb4b0oBtq4OCcHRv3D',
    name: 'きつねこ',
    booth: '3F-す04',
  },
  {
    id: 'QHslMxxV529XBLM28QuR',
    name: 'Math Relish',
    booth: '3F-す05',
  },
  {
    id: '9rJtl2uBmf79oRf7BHdd',
    name: 'へにゃぺんて',
    booth: '3F-す06',
  },
  {
    id: '8ILZynaaA0Y8fPNZ8SKL',
    name: 'うたたね',
    booth: '3F-す07',
  },
  {
    id: 'kGG9Dr4mYBcfeou51Ys3',
    name: 'あきばよめ',
    booth: '3F-す08',
  },
  {
    id: '1zkS3k70cZSca73HnXr0',
    name: 'いもあらい。',
    booth: '3F-せ01',
  },
  {
    id: 'se7G0VbBtx5s87LL9YXb',
    name: 'LAYER:03',
    booth: '3F-せ02',
  },
  {
    id: 'vg7YdP4Ic9NWDNNjU9MI',
    name: 'らいがし式',
    booth: '3F-せ03',
  },
  {
    id: '8EcQthbldruRsWR5XLnZ',
    name: 'みどりでぃんでぃん',
    booth: '3F-せ04',
  },
  {
    id: 'QekZI4VkwfdH4To2cS1j',
    name: 'とこしえ工房',
    booth: '3F-せ05',
  },
  {
    id: 'zWwWlqqGAOvwDrghuMVt',
    name: 'テスターちゃん',
    booth: '3F-せ06',
  },
  {
    id: 'QYynWto6ZfYmj9AGySRi',
    name: '音引屋',
    booth: '3F-そ01',
  },
  {
    id: 'ROahj1IRHTW9S96D8aCg',
    name: 'IM@Study',
    booth: '3F-そ02',
  },
  {
    id: 'DFTaVYTYMNB2nUsTUQVE',
    name: '軍事学習社',
    booth: '3F-そ03',
  },
  {
    id: 'TgiwvJqrTFzTqmgGxzn4',
    name: 'mystt',
    booth: '3F-そ04',
  },
  {
    id: 'XACMnGGns8XygQIjhNqr',
    name: 'るてんのお部屋',
    booth: '3F-そ05',
  },
  {
    id: 'JbDBoPlBolYtwlJnJUXa',
    name: '聖地会議',
    booth: '3F-た01',
  },
  {
    id: 'kS9gklYZb3BMvtz2yGg3',
    name: 'MERY Engineer Team',
    booth: '3F-た02',
  },
  {
    id: 'WHPDkvq96wRGpgBQ2Zuf',
    name: 'インターステラ株式会社出版部',
    booth: '3F-た03',
  },
  {
    id: 'I5qvpnIPTfuGkIS6zkND',
    name: 'アンテナハウスCAS電子出版',
    booth: '3F-た04',
  },
  {
    id: 'eXdOQuwL5l14P6MepPhw',
    name: '株式会社HHM',
    booth: '3F-た05',
  },
  {
    id: 'MHGbaEuFS9ndpk8o0Go5',
    name: '増井技術士事務所',
    booth: '3F-た06',
  },
  {
    id: 'DHqLUWMJI4q0WyubWHog',
    name: '翔泳社',
    booth: '3F-た07',
  },
]

const gishohaku3Circles = [{ id: 'XXXXXXXXXXXXXXXXXXXX', name: '運営事務局', booth: 'Z-99' }]
const gishohaku4Circles = [{ id: 'XXXXXXXXXXXXXXXXXXXX', name: '運営事務局', booth: 'Z-99' }]
const gishohaku5Circles = [
  { id:"5MKQNib7wm1Qmw4eFPZr", name:"良能技研", booth:"01" },
  { id:"bXkDuiJQLJICamEngCfU", name:"tenteroring project", booth:"02" },
  { id:"MZnH51CJ3pQMTg4vYzpL", name:"BLACK FTZ", booth:"03" },
  { id:"NZDH8e2kGGR6gmFLpQVR", name:"味噌とんトロ定食", booth:"04" },
  { id:"6yIfhkyHhmKjldaZ8NOk", name:"浜風もっこす", booth:"05" },
  { id:"x638ruPlub7Xztkkjb7p", name:"エモist出版", booth:"07" },
  { id:"qpzXswBL3ftlibIlflkI", name:"ねこはうす", booth:"08" },
  { id:"ovDqdeDyuuKr4k1GF3j5", name:"OHK", booth:"09" },
  { id:"SfVQOTVobtJxuGmwyvpv", name:"じゅ～しぃ～すくりぷと", booth:"11" },
  { id:"PWk4u8bxNKxpfFMu43MD", name:"Mathematica研究会狛江支部", booth:"12" },
  { id:"CAG2RkAfWSJYEXUullfj", name:"まぐろのみぞおち", booth:"13" },
  { id:"TmH7ZayOKvuOVmAZvsvR", name:"ひたひた", booth:"14" },
  { id:"AuaO0h7FcSLtPrkBdhtv", name:"株式会社メディアドゥ", booth:"15" },
  { id:"nBnXznGCKLSbszorsS2w", name:"Auth屋", booth:"16" },
  { id:"xBebYdecntKrSRRA0u1r", name:"aozora Project", booth:"18" },
  { id:"K9FJMTBXcEb58BdPwhcz", name:"おおきにまる", booth:"19" },
  { id:"vjx0BzogOwAdk2u1zV1I", name:"テスターちゃん", booth:"20" },
  { id:"xhT6L7JqSzkHTZfJSe71", name:"しょ〜とらば〜ず", booth:"21" },
  { id:"PGCYU7QxTO8OBaCyfW26", name:"誤家庭工房", booth:"22" },
  { id:"A5MhltszLxdMYDJfikDy", name:"こじくれワークス", booth:"23" },
  { id:"JxhZ2NZyOaT3eyqvzf8P", name:"電子工作社＆PikoPiko Factory", booth:"24" },
  { id:"hRrSG9IZADYFq4INeHrv", name:"Shinko Lab", booth:"25" },
  { id:"HvNo2zrEFnh7N6Dnmu8p", name:"きじのしっぽ", booth:"26" },
  { id:"3BaJoxF4tl9DWFvwKo27", name:"kinnekoの薄い本屋", booth:"28" },
  { id:"jGfkSMRxPfjGzRTY6MjK", name:"ふがふが", booth:"30" },
  { id:"m8eY74lJVNMjRLcnq8Ne", name:"脆弱性診断研究会", booth:"31" },
  { id:"bP1MYJuwj2MOpTDXehyZ", name:"JSTQB Advanced Level 試験対策勉強会", booth:"32" },
  { id:"X8L1KkqJbIC8dIrgjZ04", name:"ちんちらんど", booth:"33" },
  { id:"JnnJ1huJHGeEdOzG5qod", name:"エゥーゴ", booth:"35" },
  { id:"OM47hzQvVZMzZvawWvAK", name:"ENGINY", booth:"36" },
  { id:"L4UH6pXQhG3Bfzg75Zj6", name:"もふもふ.dev", booth:"37" },
  { id:"hjrdaIS40m2OkvYv9u8O", name:"お台場計算尺", booth:"41" },
  { id:"BjSeByYGhBrvhUfG9BLZ", name:"たいら屋", booth:"42" },
  { id:"A045tiArR0f7FPJ4OBuQ", name:"いもあらい", booth:"43" },
  { id:"xVpLsWlgvtnKWL459r2r", name:"くろまめ屋", booth:"44" },
  { id:"01yNsExFLe0hkwTidLMs", name:"GATOMICARISE", booth:"45" },
  { id:"zevU9CtUnAoDni4Dm1LI", name:"ブライトシステム", booth:"46" },
  { id:"cGXz9v3hBFd4QrtAVukh", name:"音引屋", booth:"47" },
  { id:"gDe9RUD8TbPriQB6WKBr", name:"遊戯部すずき組", booth:"49" },
  { id:"2oUf4Z6afBiE8jwh2MIJ", name:"親方Project", booth:"51" },
  { id:"ObVoKShoqLDgcHkTHHR3", name:"ssmjp同人部", booth:"52" },
  { id:"LEbxPS8epJw9DpdkH4kX", name:"誰も知らない出版", booth:"53" },
  { id:"XcUJ4DAkKtKXlHrIqU8H", name:"とこしえ工房", booth:"54" },
  { id:"e1ElZ40CCFKqBFrOmBRK", name:"Dobo×Pro", booth:"55" },
  { id:"FLAe5SVYLvoARqPWhGxV", name:"Just1factory", booth:"56" },
  { id:"hTLcIaD1DVqgBvet72pW", name:"ヒラメ・トロ", booth:"58" },
  { id:"Q6wC4EuceMh4lhlegE2O", name:"Atelier Beta", booth:"59" },
  { id:"AByGQqONiQPOyHeWNidY", name:"フトンカブーレ", booth:"62" },
  { id:"Vgmxg7C9N8hhI4w9VyCc", name:"モウフカブール", booth:"63" },
  { id:"3RNqIUAaEazfcdhmPNEk", name:"I/O技書博部", booth:"64" },
  { id:"KsLlenqA6IHMqk7Zaj9P", name:"エンジニアフレンドリーシティ福岡", booth:"65" },
  { id:"T2Uo4m3Rq7eo4eftBaff", name:"湊川あいの、わかば家。", booth:"66" },
  { id:"ecBfAVbYfYaE0Yk09Wja", name:"チームになったササキ", booth:"67" }
]
const gishohaku6Circles = [{ id: 'XXXXXXXXXXXXXXXXXXXX', name: '運営事務局', booth: 'Z-99' }]
const gishohaku7Circles = [
  { id: 'vpJRICRliL6LGZQSEguS', name: 'とうきょうかがく同人', booth: 'あ-01' },
  { id: 'gr57y0o7VVswoCXOLpwh', name: 'FREES', booth: 'あ-02' },
  { id: 'NVyViS4Fg3SWf49ujIY5', name: '福岡市（エンジニアフレンドリーシティ福岡）', booth: 'あ-03' },
  { id: 'FaMjBSePxUDMgYl4XjnI', name: 'でしぷろんぷと', booth: 'あ-04' },
  { id: 'tI3q25rbR34UCJnJsAeR', name: 'tenteroring project', booth: 'あ-05' },
  { id: 'nQXkwq73vzBLFT9U0Pbt', name: 'タイニーコア', booth: 'あ-06' },
  { id: 'NaEZC4pnTn96DSEzggyl', name: 'へにゃぺんて', booth: 'あ-07' },
  { id: '6udJMirSxzohFeXHhgEo', name: 'ねこはうす', booth: 'い-01' },
  { id: '0LcJZUpFEykMwLYad6Z1', name: 'OHK', booth: 'い-02' },
  { id: 'CyTDVBuTy6mXvKQyufnC', name: 'しょぼんブログ', booth: 'い-03' },
  { id: 'hc5Bo3OGPsjHLYAgtqCW', name: 'めもおきば', booth: 'い-04' },
  { id: 'jNDeaw1XZ1pUapm4roQ8', name: '人生適当', booth: 'い-05' },
  { id: 'ARBElUj6rwoeeSolyizt', name: '良能技研', booth: 'い-06' },
  { id: 'VCHc7tMnzInnV583uWHO', name: '猫耳堂', booth: 'い-07' },
  { id: 'JFffMiRav5xDH1wDw2Ge', name: '鉄道同人技術研究所', booth: 'い-08' },
  { id: 'TkLsplyncBLIW6jCe7Ct', name: 'G Storm', booth: 'い-09' },
  { id: 'ghqK63TYSn71QbaIYnqt', name: 'きつねいんかまくら', booth: 'い-10' },
  { id: 'NQYA50TBEAki56nQRLmB', name: 'OSPN(Open Source People Network)', booth: 'い-11' },
  { id: 'M6LWcrQcUx2ASWk6wtFc', name: 'BLACK FTZ', booth: 'い-12' },
  { id: 'pbFxwoPdhgU6GKsLL2lg', name: 'ZOB.Club', booth: 'い-14' },
  { id: 'rHS6mioas8tHbcp2SGJh', name: 'デザイン読書日和', booth: 'う-01' },
  { id: '51itSdvvrb28BnRcnofB', name: 'Just1factory', booth: 'う-02' },
  { id: '4eS81IIimU8MBfyeGWrW', name: 'さくらインターネット株式会社', booth: 'う-03' },
  { id: 'jrFUeGJdx5KPYlw2iM1D', name: 'choco_hack', booth: 'う-04' },
  { id: '6H7o3fL8bhXoQYTjI7lX', name: '脆弱性診断研究会', booth: 'う-05' },
  { id: 'BaFWvDNpsGyG4FqzzuL9', name: 'のみぞーん', booth: 'う-06' },
  { id: 'ukNQOq2yXM7g1v0QIc83', name: 'Auth屋', booth: 'う-07' },
  { id: 'uj10uzaQl9hPqq16Skns', name: 'ENGINY', booth: 'う-08' },
  { id: 'p4uMtpiZbm3j4L98lgMs', name: 'ふぃーるどのーつ', booth: 'う-09' },
  { id: 'njVShczAuIyhzvLKPEjg', name: 'Aurantifolia', booth: 'う-10' },
  { id: 'zy2MtW7fLikVu1AJBqgQ', name: 'ウインダム工房', booth: 'う-11' },
  { id: 'VyDNWZj3X8jtFxl8N0J3', name: 'TeamJ', booth: 'う-12' },
  { id: 'djs08WhCcBlRcvXsEV12', name: '湊川あいの、わかば家。', booth: 'う-14' },
  { id: 'tkegkbsDZH9auW51HzEf', name: 'お台場計算尺', booth: 'え-01' },
  { id: '8DG3X3PnG0Du1ul8k1WL', name: 'Math Relish', booth: 'え-02' },
  { id: 'qFLMHx43WSDHXfWriHYH', name: 'いもあらい。', booth: 'え-03' },
  { id: '8fKr52quppPzHgLvRhyq', name: 'たいら屋', booth: 'え-04' },
  { id: 'ClgqLOqtn2bHl7n5xPmk', name: 'ちんちらんど', booth: 'え-05' },
  { id: 'CjVjdYKyBk4oJ94bF3dQ', name: '品質公団', booth: 'え-06' },
  { id: 'xrUPtYpZ45cRKBSz7nJB', name: 'まぐろのみぞおち', booth: 'え-08' },
  { id: 'VEShYwedr4THQOMHWehS', name: 'Personal Factory', booth: 'え-09' },
  { id: 'uFRrSpUSCLwve8dgQM7Z', name: 'URAMASU', booth: 'え-10' },
  { id: 'U9PwNF924CXkQIxb55Yh', name: '電脳世界', booth: 'え-11' },
  { id: 'wTkYRjdyPZBQUCfxAEWc', name: '白熊出版会', booth: 'え-12' },
  { id: 'hxtyUEGD3YXQE4UQxhki', name: 'くるみ割り書房', booth: 'え-14' },
  { id: 'sLuUVwQWI2eHEKwf7nGY', name: '親方Project', booth: 'お-01' },
  { id: 'nlrxtCWL2nEd2gEAuKqx', name: 'ブライトシステム', booth: 'お-02' },
  { id: '3y3tFGoUplZgJ5bSQKJG', name: '株式会社システムアイ', booth: 'お-03' },
  { id: '64sEl3ZQjNIGt8WVREKT', name: 'エンジニアカウンセラー', booth: 'お-04' },
  { id: '1tc5ilOxJpEePw1i3ruK', name: 'Growthfaction 〜成長と充実を研究する会〜', booth: 'お-05' },
  { id: 'ZEdMevkkuZv1u1sV4ECQ', name: 'GATOMICARISE', booth: 'お-06' },
  { id: 'HV8Q5n2tNZZqsaAHakAz', name: '聖地会議', booth: 'お-07' },
  { id: '5kaxPnBHkRCJiWAvf2pg', name: '音引屋', booth: 'お-08' },
  { id: 'pUcUZzdfzYOLfmHzYa0i', name: '関数型玩具製作所', booth: 'お-09' },
  { id: 'upXd3HWvq0t25RhY1Xul', name: 'AliceSystem', booth: 'お-10' },
  { id: 'xSISwyGdwYopDcVJ6mlC', name: 'フトンカブーレ', booth: 'お-11' },
  { id: '2JzlHvOtJPYbtzx8ygxS', name: 'モウフカブール', booth: 'お-12' },
  { id: 'haA1Q0bqhkmlTs2lwuGP', name: 'I/O技書博部', booth: 'お-13' },
  { id: 'QkjDerAVTAxHXtuY2FFN', name: 'きじのしっぽ', booth: 'か-01' },
  { id: 'oRarYUYvJuv61j4T2NsV', name: '電脳律速', booth: 'か-02' },
  { id: '6uO12yLWJJOPJXxBA3u3', name: 'ふがふが', booth: 'か-03' },
  { id: 'r53CsGcQ1ci4Yg4sJyXW', name: 'Shinko Lab.', booth: 'か-04' },
  { id: '63x0KLtIvvj6lOVAGBAm', name: 'しまや出版', booth: 'か-05' },
  { id: '9p2IPDVOvzZoRn2xTXwi', name: 'Piece of Technology', booth: 'か-06' },
  { id: 'wAPKmVwXksEwrGGCBWd0', name: 'ノラハック', booth: 'か-07' },
  { id: 'WQm3ApJyBLv9RxJLrcOk', name: '熱海怪獣映画祭', booth: '物販-01' },
]
const gishohaku8Circles = [
  { id: '2sjwBuTYnNh4lP8fubds', name: '福岡市', booth: 'あ-01' },
  { id: 'u4RbQ4nRv6ioY1xQ3ESG', name: '親方Project', booth: 'あ-02' },
  { id: 'OtchSmoriV8JrwR5zfbm', name: 'ゆめみ大技林製作委員会', booth: 'あ-03' },
  { id: '4f8Sj13yfUC3coWVNcUl', name: 'Just1factory', booth: 'あ-04' },
  { id: 'xVMY2KtyYWAdp6xku81Y', name: 'Type D4 Lab', booth: 'あ-05' },
//  { id: 'wwGIqqq6RsN5A39eSkeM', name: 'ピープルソフトウェア', booth: 'あ-06' },
  { id: 'RtpDcAMIx3pWJ2xDpWRx', name: 'Rails Girls わんだーらんど', booth: 'あ-07' },
  { id: 'Tk2mFiVwcTvT0jQJJA0s', name: 'システム工学研究会', booth: 'あ-08' },
  { id: 'EoDBG78VdTq7QJZEKVmi', name: '電脳世界', booth: 'あ-09' },
  { id: 'mpQ2NDQrSTmzqASeRHvR', name: 'のみぞーん', booth: 'あ-10' },
  { id: 'R2wVDfaCIuiA45JCvD13', name: 'Auth屋', booth: 'あ-11' },
  { id: '68NVrbp4WNZH7Wn8xQmj', name: '脆弱性診断研究会', booth: 'あ-12' },
  { id: 'WGHb8TlWgGFDR0S1PX7r', name: '半田技術研究所', booth: 'あ-13' },
  { id: 'jjpT7h22q1xwlTbBAHuk', name: 'Aurantifolia', booth: 'あ-14' },
  { id: 'JvWJArOvzBFrx3w9l7Ck', name: 'へにゃぺんて', booth: 'い-01' },
  { id: 'bCZk9NDvsnRdb269VlPy', name: 'みやこ電子工房', booth: 'い-02' },
  { id: 'psMAlQDlMGZvDvg2ONV5', name: '徒然メカ', booth: 'い-03' },
  { id: 'UqHENcox3bF6dyulEzvp', name: 'まぬる猫の工作部屋', booth: 'い-04' },
  { id: 'xpyFZNXdPjjeQOLn7Sd3', name: 'CNMTC', booth: 'い-05' },
  { id: 'aOydtomnKIsVisbzpiHq', name: 'きんとーん・らぼ', booth: 'い-06' },
  { id: 'nUjOVrkuNE7wdsGsT4A8', name: 'いもあらい。', booth: 'い-08' },
  { id: 'ESPSsKkaYDC3Np2xBHSR', name: 'たいら屋', booth: 'い-09' },
  { id: 'lYtZVfGUSXZ0yOwg1vu3', name: 'Mathematica研究会葛飾支部', booth: 'い-10' },
  { id: 'vrANWdPXwatvAI2fCM2s', name: 'からあげ', booth: 'い-12' },
  { id: 'SFWL7J35kJPMGGa90KpE', name: 'モウフカブール', booth: 'い-13' },
]
const gishohaku9Circles = []

const container = css`
  margin: 0 auto;
  padding: 12px;
  background-color: white;
  border-bottom: 1px solid #ddd;
  position: sticky;
  z-index: 101;
  top: 0;
`

const CircleSelect: React.FC<Props> = ({ circleId, starIds }) => {
  const router = useRouter()
  const { eventId } = useContext(EventContext)
  const circles = {
    gishohaku1: gishohaku1Circles,
    gishohaku2: gishohaku2Circles,
    gishohaku3: gishohaku3Circles,
    gishohaku4: gishohaku4Circles,
    gishohaku5: gishohaku5Circles,
    gishohaku6: gishohaku6Circles,
    gishohaku7: gishohaku7Circles,
    gishohaku8: gishohaku8Circles,
    gishohaku9: gishohaku9Circles,
  }[eventId]
  const index = circles.findIndex((c) => c.id === circleId)
  const nextCircle = circles[index + 1]
  const prevCircle = circles[index - 1]
  const pushCircle = useCallback((id: string) => {
    router.push('/[eventId]/circles/[id]', `/${eventId}/circles/${id}`)
  }, [])

  return (
    <div css={container}>
      <div
        css={css`
          display: flex;
          max-width: 1112px;
          margin: 0 auto;
          justify-content: center;
          button {
            min-width: 40px;
          }
        `}>
        {prevCircle ? (
          <IconButton
            component="button"
            variant="outline"
            icon={<IconChevronLeft />}
            label={prevCircle.name}
            onPress={() => {
              pushCircle(prevCircle.id)
            }}
          />
        ) : (
          <IconButton
            component="button"
            variant="ghost"
            icon={<IconChevronLeft />}
            label="prev circle is none"
            disabled={true}
          />
        )}
        <Select
          value={circleId}
          onChange={(e) => {
            const id = e.target.value
            pushCircle(id)
          }}>
          {circles.map((option) => {
            return (
              <option key={option.id} value={option.id}>
                {starIds.includes(option.id) && '★ '} {option.booth}{' '}
                {option.name}
              </option>
            )
          })}
        </Select>
        {nextCircle ? (
          <IconButton
            component="button"
            variant="outline"
            icon={<IconChevronRight />}
            label={nextCircle.name}
            onPress={() => {
              pushCircle(nextCircle.id)
            }}
          />
        ) : (
          <IconButton
            component="button"
            variant="ghost"
            icon={<IconChevronRight />}
            label="next circle is none"
            disabled={true}
          />
        )}
      </div>
    </div>
  )
}

export default CircleSelect
