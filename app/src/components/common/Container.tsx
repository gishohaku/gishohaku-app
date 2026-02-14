/** @jsx jsx */
import { jsx, css } from '@emotion/react'

export const Container: React.FC<{
  className?: string
}> = ({ children, className }) => {
  return (
    <div
      css={css`
        width: 100%;
        max-width: 1200px;
        box-sizing: border-box;
        margin-left: auto;
        margin-right: auto;
        padding: 0 1rem;

        @media (min-width: 992px) {
          padding: 0 1.5rem;
        }
      `}
      className={className}>
      {children}
    </div>
  )
}
