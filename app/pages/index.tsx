/** @jsx jsx */
import Sections from "../components/top/sections"
import { css, jsx } from '@emotion/core'
import logo from '../images/fullLogo.png'
import { media } from '../utils/style'
import TextBlock from "../components/atoms/TextBlock"
import placeIcon from '../components/top/round-place.svg'
import directionsIcon from '../components/top/round-directions_run.svg'

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
      padding: 16px;
      align-items: start;
    }
  `}>
    <img css={css`
      @media ${media.small} {
        width: 120px;
        margin-bottom: 24px;
        margin-left: -8px;

      }
    `} src={logo} width={200} height={256} />
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

const section = css`
  padding: 48px 0;
  background-color: white;
  @media ${media.small} {
    padding: 32px 0;
  }
`

export default () => {
  return <>
    <Hero />
    <section css={section}>
      <SectionHeader en="ABOUT">技書博とは？</SectionHeader>
      <TextBlock>
        <p>
          技術書同人誌博覧会（技書博）は、エンジニア（おもにITエンジニア）が自身の知見を「本」という形で共有するために開催される、技術書オンリーイベント（同人誌頒布即売会）です。
          私たちエンジニアは、日々の業務や学習によって得た膨大な知識を記憶し、活かしています。
          その知識の大半は「暗黙知」として個人の中に留まり続け、他者に共有できていない有用な情報がたくさんあるのではないでしょうか。
          私たちは、知識を「集合知」としてコミュニティに還元しあうことによって、何倍もの知識を吸収でき、よりよい世界を作り出せると考えています。
        </p>
      </TextBlock>
    </section>
    <section css={[section, css`background-color: #f7f8fa;`]}>
      <SectionHeader en="ACCESS">アクセス</SectionHeader>
      <TextBlock>
        <p
          css={css`
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            @media ${media.small} {
              font-size: 24px;
            }
          `}
        >
          プラザマーム
        </p>
        <div
          css={css`
            background-color: #fff;
            padding: 12px;
            border-radius: 4px;
            margin-top: 12px;
          `}
        >
          <p css={withIcon}>
            <img src={placeIcon} alt="住所" />
            東京都中央区日本橋浜町1-1-12（
            <a href="https://goo.gl/maps/8b45soYqMvtZK2498">
              Google マップ
            </a>
            ）
          </p>
          <p css={withIcon}>
            <img src={directionsIcon} alt="アクセス" />
            浅草線 人形町駅より徒歩6分・浅草線 東日本橋駅より徒歩4分
            <br />
            新宿線 浜町駅より徒歩2分・新宿線 馬喰横山駅より徒歩8分
            <br />
            日比谷線 人形町駅より徒歩6分
            <br />
            半蔵門線 水天宮前駅より徒歩15分
            <br />
            総武線 馬喰町駅より徒歩8分
          </p>
        </div>
      </TextBlock>
    </section>
    {/* <Sections /> */}
  </>
}

const withIcon = css`
  position: relative;
  padding-left: 30px;
  margin-top: 4px;
  img {
    position: absolute;
    left: 0;
    opacity: 0.3;
  }
`

const SectionHeader: React.FC<{
  en: string
}> = ({ children, en }) => {
  return <h2 css={css`
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
      background-color: ${orange};
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
    <small>{en}</small>{children}
  </h2>
}
