/** @jsx jsx */
import { jsx, css } from '@emotion/core'

interface Props {
  isChecked: boolean
  onClick: (event: any) => void
}

const CheckButton : React.FC<Props> = ({isChecked, onClick}) => {
  return <div css={css`
    margin-left: auto;
    border: 1px solid #2A5773;
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 15px;
    font-weight: 600;
    transition: all .2s ease;
    white-space: nowrap;
    cursor: pointer;
    background-color: ${isChecked ? 'transparent' : '#2A5773'};
    color: ${isChecked ? '#2A5773' : 'white'};
    &:hover {
      background-color: #2A5773;
      color: white;
    }
  `} onClick={onClick}>{isChecked ? 'チェック済み' : 'チェックする'}</div>
}

export default CheckButton