/** @jsx jsx */
import Sections from "../components/top/sections"
import { css, jsx } from '@emotion/core'
import logo from '../images/fullLogo.png'
import { media, colors } from '../utils/style'

const orange = '#E1740C'

const LinkButton: React.SFC<{
  href: string
}> = ({ href, children }) => (
  <a css={css`
    font-size: 16px;
    color: ${orange};
    font-weight: bold;
    padding: 12px 16px;
    background-color: white;
    display: inline-block;
    text-decoration: none;
    border-radius: 4px;
    margin-right: 8px;
    min-width: 200px;
    text-align: center;
    @media ${media.small} {
      margin: 8px 0 0;
      display: block;
    }
  `} href={href}>{children}</a>
)

const Hero = () => (
  <div css={css`
    background-color: ${orange};
    color: white;
    padding: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    @media ${media.small} {
      flex-direction: column;
      padding: 12px;
      align-items: start;
    }
  `}>
    <img css={css`
      @media ${media.small} {
        width: 120px;
        margin-bottom: 24px;
        margin-left: -8px;

      }
    `} src={logo} width={200} />
    <div css={css`
      margin-left: 24px;
      @media ${media.small} {
        margin-left: 0;
        width: 100%;
      }
    `}>

      <h1 css={css`
      font-size: 30px;
      font-weight: bold;
      display: flex;
      align-items: center;
      small {
        font-size: 20px;
        background-color: white;
        color: ${orange};
        display: inline-block;
        padding: 2px 16px;
        margin-right: 8px;
        border-radius: 4px;
      }
      @media ${media.small} {
        font-size: 24px;
        small {
          font-size: 16px;
        }
      }
    `}>
        <small>第二回</small>技術書同人誌博覧会
    </h1>
      <div css={css`
      margin-top: 8px;
      font-size: 36px;
      font-weight: 500;
      font-family: 'Poppins', sans-serif;
      line-height: 1.2;
      small {
        font-size: 24px;
      }
      @media ${media.small} {
        font-size: 28px;
      }
    `}>2019.12.14 <small>Sat. 11:00~17:00</small></div>
      <div css={css`
      font-size: 20px;
      font-weight: bold;
      @media ${media.small} {
        font-size: 16px;
      }
    `}>
        @プラザマーム（東京日本橋）</div>
      <div css={css`margin-top: 16px;`}>

        <LinkButton href="/gishohaku2/circles">一般参加の案内</LinkButton>
        <LinkButton href="/gishohaku2/circles">サークル参加の案内</LinkButton>
      </div>
    </div>
  </div>
)

export default () => {
  return <>
    <Hero />
    <Sections />
  </>
}