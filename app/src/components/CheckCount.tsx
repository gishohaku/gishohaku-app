/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import check from '../images/check.svg'

interface Props {
  count: number
}

const CheckCount: React.FC<Props> = ({ count }) => {
  // FIXME(mottox2): 状態管理ライブラリを入れるべき。やっぱりpropsリレーしんどい
  return (
    <div
      css={css`
        border: 1px solid #eee;
        background-color: #eee;
        text-decoration: none;
        padding: 6px 12px;
        border-radius: 4px;
        min-width: 72px;
        text-align: center;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: auto !important;
        > img {
          margin-right: 4px;
          opacity: 0.4;
          width: 22px;
        }
      `}>
      <img src={check} />
      <span>{count}</span>
    </div>
  )
}

export default CheckCount
