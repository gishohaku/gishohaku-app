/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { IconCheck, IconHeart } from 'sancho'

interface Props {
  isChecked: boolean
  onClick: (event: any) => void
}

const CheckButton: React.FC<Props> = ({ isChecked, onClick }) => {
  return (
    <div
      css={css`
        margin-left: auto;
        border: 1px solid #2a5773;
        text-decoration: none;
        padding: 6px 12px;
        text-align: center;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 600;
        transition: all 0.2s ease;
        white-space: nowrap;
        cursor: pointer;
        background-color: ${isChecked ? 'transparent' : '#2A5773'};
        color: ${isChecked ? '#2A5773' : 'white'};
        display: flex;
        justify-content: center;
        align-items: center;

        svg {
          margin-right: 6px;
        }
      `}
      onClick={onClick}>
      {isChecked ? (
        <>
          <IconCheck fill="white" />
          チェック済み
        </>
      ) : (
        <>
          <IconHeart fill="white" stroke="none" />
          チェックする
        </>
      )}
    </div>
  )
}

export default CheckButton
