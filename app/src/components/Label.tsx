/** @jsx jsx */
import { jsx, css } from '@emotion/core'

const Label: React.FC<{
  text: string
  color?: string
  backgroundColor?: string
}> = ({ text, color, backgroundColor }) => {
  return (
    <p
      css={css`
        font-size: 12px;
        padding: 4px 8px;
        line-height: 1.2;
        display: inline-block;
        background-color: ${backgroundColor || '#e1e5ec'};
        border-radius: 2px;
        margin-right: 4px;
        color: ${color || 'rgba(0, 0, 0, 0.6)'};
        font-weight: bold;
      `}>
      {text}
    </p>
  )
}

export default Label
