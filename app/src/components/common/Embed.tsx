/** @jsx jsx */
import { jsx, css } from '@emotion/core'

type Props = {
  width: number
  height: number
  className?: string
}

export const Embed: React.FC<Props> = ({
  children,
  width,
  height,
  className,
}) => {
  const percentage = (height / width) * 100
  return (
    <div
      className={className}
      css={css`
        position: relative;
        display: block;
        width: 100%;
        padding: 0;
        & > * {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }
        ::before {
          display: block;
          content: '';
          padding-top: ${percentage}%;
        }
      `}>
      {children}
    </div>
  )
}
