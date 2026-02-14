/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import { media, colors } from '../utils/style'

// TODO: move to style
const keyColor = colors.primaryDarker

const SectionHeader: React.FC<{
  en: string
}> = ({ children, en }) => {
  return (
    <h2
      css={css`
        font-weight: bold;
        margin: 0 16px;
        font-size: 32px;
        text-align: center;
        padding-bottom: ${12 + 3}px;
        position: relative;
        @media ${media.small} {
          font-size: 24px;
          text-align: left;
        }
        &:after {
          content: ' ';
          position: absolute;
          height: 3px;
          width: 80px;
          bottom: 0;
          display: block;
          background-color: ${keyColor};
          left: 50%;
          transform: translateX(-50%);
          @media ${media.small} {
            left: auto;
            transform: none;
          }
        }
        small {
          display: block;
          font-family: 'Poppins', sans-serif;
          font-size: 18px;
          font-weight: 500;
          opacity: 0.6;
          line-height: 1;
          margin-bottom: 4px;
        }
      `}>
      <small>{en}</small>
      {children}
    </h2>
  )
}

export default SectionHeader
