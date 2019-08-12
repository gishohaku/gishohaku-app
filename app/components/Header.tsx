/** @jsx jsx */
import Link from 'next/link'

import logo from '../images/logo.png'
import { media } from '../utils/style'

import { jsx, css } from '@emotion/core'

const Header: React.FC<any> = () => {
  return <header
    css={css`
      background-color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      padding: 0 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      min-height: 80px;
      @media ${media.small} {
        padding: 0;
      }
    `}
  >
    <Link href="/" passHref>
      <a
        css={css`
          &:hover {
            background-color: #eff0f0;
          }
          &:active {
            background-color: #dededf;
          }
        `}
      >
        <img
          src={logo}
          width={80}
          height={80}
          css={css`
            display: block;
          `}
          alt="技術書同人誌博覧会"
        />
      </a>
    </Link>
  </header>
}


export default Header
