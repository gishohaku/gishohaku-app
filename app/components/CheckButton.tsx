/** @jsx jsx */
import { jsx, css } from '@emotion/core'

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
      `}
      onClick={onClick}
    >
      {(() => {
        if(isChecked){
          return (
            <div>
              <span
                className="material-icons"
                css={css`
                  vertical-align: middle;
                  margin-right: 2px;
                  font-size: 20px;
                `}
              >
                favorite_border
              </span>
              <span
                css={css`
                  vertical-align: middle;
                `}
              >
                チェック済み
              </span>
            </div>
          )
        }
        return (
          <div>
            <span
              className="material-icons"
              css={css`
                vertical-align: middle;
                margin-right: 2px;
                font-size: 20px;
              `}
            >
              favorite
            </span>
            <span
              css={css`
                vertical-align: middle;
              `}
            >
              チェックする
            </span>
          </div>
        )
      })()}
    </div>
  )
}

export default CheckButton
