/** @jsx jsx */
import { Select, IconButton, IconChevronLeft, IconChevronRight } from "sancho";
import { NextRouter } from "next/router";
import { jsx, css } from '@emotion/core'
import { media } from "../utils/style";
import { useCallback } from "react";

interface Props {
  circleId: string
  starIds: string[]
  router: NextRouter
}

// TODO: イベント終わったら静的ファイル化して外に出す
const circles = [{ id: 'GZbC0MSg0OKK9S4FcplO', name: 'aNo研', booth: 'A-1' },
{ id: 'kYULXovSWzu8GSThev87', name: 'きじのしっぽ', booth: 'A-2' },
{ id: 'JaxqUYEGAE3HLqxiHvgS', name: 'MZ工房', booth: 'A-3' },
{ id: 'aareCSVXghoyNp6lTFkr', name: 'これなりハウス', booth: 'A-4' },
{ id: '6gNqzVdWmcyVi26cdrX3', name: 'お台場計算尺', booth: 'A-5' },
{
  id: '1kGxUoK2Q19qZ5ad7Hrw',
  name: 'あいらぶ量子コンピュータ',
  booth: 'A-6'
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
  booth: 'A-17'
},
{ id: 'FjoGG8Tx5OE2meIKacwa', name: 'イカも競技も下手くそ', booth: 'A-18' },
{
  id: 'byjsr8nhaQY30s0Nkhw8',
  name: 'kuluna.class',
  booth: 'A-19'
},
{ id: 'GSOOquYqzcs7lRMIyLOo', name: '杜の都の開発室', booth: 'A-20' },
{
  id: '15SWB19UpPFmEbMoxwuK',
  name: 'MERY Engineer Team',
  booth: 'B-1'
},
{ id: '92TDvTqSyA9I7jnDSACP', name: 'ダックタイピング', booth: 'B-2' },
{ id: '7nAGEPa9Rl9UBnfQRs0e', name: 'umitsuki', booth: 'B-3' },
{ id: 'B7Qcb4Y6iJLL3FCZWKKL', name: 'Heriet', booth: 'B-4' },
{
  id: '9DJu2nvhnTaZWZkJ0WJU',
  name: 'Dodgson Labs',
  booth: 'B-5'
},
{
  id: 'W6HJiybmJ1umQaX9BQlF',
  name: 'nekoze-at.tokyo',
  booth: 'B-6'
},
{ id: 'NNt0IdDL6L5oc1hoY64g', name: 'Beer2.0', booth: 'B-7' },
{ id: 'O3Jq5pDWtDoRcbtJF7G2', name: 'SCHEMANEKO', booth: 'B-8' },
{
  id: 'OPavvEWyFywTJu9i1ZmF',
  name: 'POStudy 〜アジャイル・プロダクトマネジメント研究会〜',
  booth: 'B-9'
},
{
  id: 'g3a3lYbXcroP8rL3HB67',
  name: 'プロジェクトマネージャ保護者会',
  booth: 'B-11'
},
{ id: 'M0COaVwgZyvBztfafec5', name: 'Owl eng.', booth: 'B-13' },
{
  id: '3Ywd2rxrLTZjD9344Svk',
  name: 'growthfaction',
  booth: 'B-14'
},
{
  id: 'WrqqMM9j4tsnrGxH3PpI',
  name: 'エンジニアの登壇を応援する会',
  booth: 'B-15'
},
{
  id: '77F8C9rw7iWgTQzdVbox',
  name: 'yagitch.com',
  booth: 'B-16'
},
{ id: '7YWKN13FGsxpJUlVIip2', name: 'ながら工房', booth: 'B-17' },
{ id: '77awXL0Bmem3NED5OxPQ', name: 'clear-mint', booth: 'B-18' },
{ id: '4ImAN41mbw9P6mK05QoB', name: '聖地会議', booth: 'B-19' },
{ id: 'sL12d49gD1zUGnMDRyJz', name: 'テスターちゃん', booth: 'C-1' },
{
  id: 'kD1DdAwDLpf4gFPubjer',
  name: 'にっこりさわやかファクトリー',
  booth: 'C-3'
},
{
  id: 'wrHyIUAvf8qWkhofcTK0',
  name: 'JSTQB Advanced Level 試験対策勉強会',
  booth: 'C-4'
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
  booth: 'C-17'
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
  booth: 'D-9'
},
{
  id: 'yoiSxouJ2rxPuaeJGHMw',
  name: 'Just1factory',
  booth: 'D-10'
},
{ id: 'LgpaWhufGMZWV79VVNYK', name: '湊川あいの、わかば家。', booth: 'E-1' },
{ id: 'smOKF9zaHnHPorgMA6lt', name: '水晶雫世界', booth: 'E-3' },
{ id: '0nsyABa1xIVSm3p8nhDq', name: '親方Project', booth: 'E-5' },
{ id: 'LfrDCc7IRO4VPA71nOzm', name: 'whiims', booth: 'E-7' },
{ id: 'bTx12XFa4xexGb1BRsbi', name: '虎の穴ラボ', booth: 'E-9' }]

const container = css`
  margin: 0 auto;
  max-width: 1112px;
  padding: 12px 12px 0;
  margin-top: 24px;
  display: flex;
  @media ${media.small} {
    background-color: white;
    border-bottom: 1px solid #ddd;
    padding-bottom: 12px;
    margin-top: 0;
  }
`

const CircleSelect: React.FC<Props> = ({ circleId, router, starIds }) => {
  const index = circles.findIndex(c => c.id === circleId)
  const nextCircle = circles[index + 1]
  const prevCircle = circles[index - 1]
  const pushCircle = useCallback((id: string) => {
    router.push('/gishohaku1/circles/[id]', `/gishohaku1/circles/${id}`)
  }, [])

  return <div css={container}>
    {prevCircle ?
      <IconButton variant="outline" icon={<IconChevronLeft />} label={prevCircle.name} onPress={() => {
        pushCircle(prevCircle.id)
      }} /> :
      <IconButton variant="ghost" icon={<IconChevronLeft />} label="prev circle is none" disabled={true} />}
    <Select value={circleId} onChange={(e) => {
      const id = e.target.value
      pushCircle(id)
    }}>
      {circles.map(option => {
        return <option key={option.id} value={option.id}>{starIds.includes(option.id) && "★ "} {option.booth} {option.name}</option>

      })}
    </Select>
    {nextCircle ?
      <IconButton variant="outline" icon={<IconChevronRight />} label={nextCircle.name} onPress={() => {
        pushCircle(nextCircle.id)
      }} /> :
      <IconButton variant="ghost" icon={<IconChevronRight />} label="next circle is none" disabled={true} />}
  </div>
}

export default CircleSelect