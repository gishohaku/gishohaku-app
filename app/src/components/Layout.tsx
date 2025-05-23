/** @jsx jsx */
import { colors, media } from '../utils/style'

import Link from 'next/link'
import { jsx, css, Global } from '@emotion/core'
import BottomBar from './BottomBar'
import Header, { headerHeight } from './Header'
import SEO from './SEO'
import { useContext } from 'react'
import EventContext from '../contexts/EventContext'
import Head from 'next/head'

const Layout: React.FC<any> = (props) => {
  const { eventId } = useContext(EventContext)
  return (
    <>
      <SEO />
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Noto+Sans+JP:400,700&amp;display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Poppins:500&amp;display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <Global
        styles={css`
          html {
            /* iPhoneのダブルタップによるズームを抑制 */
            touch-action: manipulation;
          }
          body {
            font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont,
              Roboto, '游ゴシック体', YuGothic, 'Yu Gothic Medium', sans-serif;
            -webkit-font-smoothing: antialiased;
            font-feature-settings: 'palt';
            font-size: 15px;
            color: #444;
            background-color: #f7f8fa;
            /* For BottomBar */
            margin-bottom: 76px;
            /* Sheetの実装とぶつかるためのimportant */
            padding-top: ${headerHeight}px !important;
          }
          p,
          li {
            line-height: 1.8;
          }

          @keyframes dot-flashing {
            0% {
              background-color: #9880ff;
            }
            50%,
            100% {
              background-color: #ebe6ff;
            }
          }
        `}
      />
      {!props.hideHeader && <Header />}
      <div
        css={css`
          min-height: calc(100vh - 80px - 88px);
          position: relative;
        `}>
        {props.children}
      </div>
      {/* TODO: sign_in/やsign_up/で死ぬので要対応 */}
      {[
        'gishohaku1',
        'gishohaku2',
        'gishohaku3',
        'gishohaku4',
        'gishohaku5',
        'gishohaku6',
        'gishohaku7',
        'gishohaku8',
        'gishohaku9',
        'gishohaku10',
        'gishohaku11',
        'gishohaku12',
      ].includes(eventId) && <BottomBar />}
      {/* {eventId === 'gishohaku12' && <MypageButton />} */}
    </>
  )
}

const MypageButton = () => {
  const { eventId } = useContext(EventContext)
  return (
    <Link href={`/${eventId}/mypage/circle`}>
      <a
        css={css`
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          background-color: #ecb40d;
          color: white;
          padding: 16px 32px;
          border-radius: 30px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          cursor: pointer;
          font-weight: 600;
          white-space: nowrap;
          &:hover {
            background-color: #dbae29;
          }
        `}>
        サークルマイページ
      </a>
    </Link>
  )
}

const Footer = () => (
  <footer
    css={css`
      background-color: ${colors.gray100};
      font-size: 12px;
      padding: 8px 12px ${72 + 16}px;
      text-align: center;
    `}>
    <ul
      css={css`
        li {
          display: inline-block;
          margin-top: 6px;
          @media ${media.small} {
            display: block;
            text-align: left;
            margin-top: 0;
          }
          > a {
            display: block;
            padding: 6px;
          }
        }
      `}>
      <li>
        <a
          target="_blank"
          href="https://gishohaku.notion.site/e987823213594baa9ac539e6a8f8923a">
          サークル向け重要説明事項
        </a>
      </li>
      <li>
        <a
          target="_blank"
          href="/code-of-conduct">
          行動規範
        </a>
      </li>
      <li>
        <a href="mailto:info@gishohaku.dev">お問い合わせ</a>
      </li>
    </ul>
    <p
      css={css`
        margin: 6px 0;
        opacity: 0.8;
      `}>
      © 技術書同人誌博覧会 運営事務局
    </p>
  </footer>
)

export default Layout
