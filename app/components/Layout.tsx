/** @jsx jsx */
import { colors, media } from '../utils/style'

import { jsx, css, Global } from '@emotion/core'
import BottomBar from './BottomBar'
import Header from './Header'
import SEO from './SEO'
import useEventId from '../useEventId'

const Layout: React.FC<any> = props => {
  const { eventId } = useEventId()
  return (
    <>
      <SEO />
      <Global
        styles={css`
          @import url(https://fonts.googleapis.com/css?family=Noto+Sans+JP:400, 700&display=swap);
          html {
            /* iPhoneのダブルタップによるズームを抑制 */
            touch-action: manipulation;
          }
          body {
            font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, Roboto, '游ゴシック体',
              YuGothic, 'Yu Gothic Medium', sans-serif;
            -webkit-font-smoothing: antialiased;
            font-feature-settings: 'palt';
            font-size: 15px;
            color: #444;
            background-color: #f7f8fa;
          }
          p,
          li {
            line-height: 1.8;
          }
        `}
      />
      {!props.hideHeader && <Header />}
      <div
        css={css`
          min-height: calc(100vh - 80px - 88px);
          position: relative;
        `}
      >
        {props.children}
      </div>
      {eventId === 'gishohaku1' && <BottomBar />}
      <Footer />
    </>
  )
}

const Footer = () => (
  <footer
    css={css`
      background-color: ${colors.gray100};
      font-size: 12px;
      padding: 8px 12px ${72 + 16}px;
      text-align: center;
    `}
  >
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
      `}
    >
      <li>
        <a href="/gishohaku1/terms">サークル参加規約</a>
      </li>
      <li>
        <a href="https://portal.engineers-lt.info/">運営</a>
      </li>
      <li>
        <a href="https://portal.engineers-lt.info/guideline">コミュニティ・ガイドライン</a>
      </li>
      <li>
        <a href="mailto:info@gishohaku.dev">お問い合わせ</a>
      </li>
    </ul>
    <p
      css={css`
        margin: 6px 0;
        opacity: 0.8;
      `}
    >
      © 技術書同人誌博覧会 運営事務局
    </p>
  </footer>
)

export default Layout
