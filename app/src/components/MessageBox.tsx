/** @jsx jsx */
import { jsx, css } from '@emotion/core'

interface Props {
  title: string
  description: string
}

const MessageBox: React.SFC<Props> = (props) => {
  return (
    <div
      css={css`
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        padding: 24px;
        background-color: white;
        border: 1px solid #e6eaf1;
        border-radius: 8px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
      `}>
      <div
        css={css`
          font-weight: 600;
          font-size: 18px;
        `}>
        {props.title}
      </div>
      <div
        css={css`
          font-size: 15px;
          opacity: 0.6;
          margin-top: 4px;
        `}>
        {props.description}
      </div>
      {props.children}
    </div>
  )
}

export default MessageBox
