/** @jsx jsx */
import Sections from "../components/top/sections"
import { css, jsx } from '@emotion/core'
import logo from '../images/fullLogo.png'
import { media } from '../utils/style'
import TextBlock from "../components/atoms/TextBlock"
import placeIcon from '../components/top/round-place.svg'
import directionsIcon from '../components/top/round-directions_run.svg'

const keyColor = '#204986'

const LinkButton: React.SFC<{
  href: string
}> = ({ href, children }) => (
  <a css={css`
    font-size: 16px;
    color: ${keyColor};
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
  `} target="_blank" rel="noopener" href={href}>{children}</a>
)

const Hero = () => (
  <div css={css`
    background-color: ${keyColor};
    color: white;
    padding: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url('/static/bg.png');
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
        font-size: 18px;
        background-color: white;
        color: ${keyColor};
        display: inline-block;
        padding: 2px 12px;
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

        <LinkButton href="https://blog.gishohaku.dev/entry/gishohaku2-attend">一般参加の案内</LinkButton>
        <LinkButton href="https://blog.gishohaku.dev/entry/gishohaku2-circle-info">サークル参加の案内</LinkButton>
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
            font-size: 24px;
            font-weight: bold;
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
            margin-top: 8px;
          `}
        >
          <p css={withIcon}>
            <img src={placeIcon} alt="住所" />
            東京都中央区日本橋浜町1-1-12（
            <a target="_blank" href="https://goo.gl/maps/8b45soYqMvtZK2498">
              Google マップ
            </a>
            ）
          </p>
          <p css={withIcon}>
            <img src={directionsIcon} alt="アクセス" />
            JR総武線 馬喰町駅 徒歩8分
            <br />
            都営地下鉄 新宿線 浜町駅 A1出口より徒歩2分
            <br />
            都営地下鉄 新宿線 馬喰横山駅 A3出口より徒歩8分
            <br />
            都営地下鉄 浅草線 東日本橋駅 B1出口より徒歩4分
            <br />
            都営地下鉄 浅草線・東京メトロ日比谷線 人形町駅 A4出口より徒歩6分
            <br />
          </p>
        </div>
        <iframe css={css`
          width: 100%;
          min-height: 240px;
        `} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.5072151593613!2d139.78382831555126!3d35.689134037145216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018894e83ede355%3A0xbcb68738d6f39a3c!2z44CSMTAzLTAwMDcg5p2x5Lqs6YO95Lit5aSu5Yy65pel5pys5qmL5rWc55S677yR5LiB55uu77yR4oiS77yR77ySIOODl-ODqeOCtuODnuODvOODoA!5e0!3m2!1sja!2sjp!4v1574141241612!5m2!1sja!2sjp"></iframe>
      </TextBlock>
    </section>
    {/* <Sections /> */}
    <section css={section}>
      <SectionHeader en="BANNER">リンクバナー</SectionHeader>
      <TextBlock>
        <p>
            当サイトへのリンクを掲載いただく際は、以下のバナーをご利用ください。
        </p>
        <p css={css`
          text-align: center;
          .banner {
            display: block;
            width: 200px;
            border: 1px solid #ddd;
          }
          .banner-outer {
            text-align: center;
            display: inline-block;
            margin: 0px 8px;
          }
          .banner-caption {
            font-size: 12px;
            color: #888;
          }
        `}>
          <div className="banner-outer">
            <img className="banner" src="/static/banner_2_600x120.png" />
            <span className="banner-caption">（大サイズ：600×120ピクセル）</span>
          </div>
          <div className="banner-outer">
            <img className="banner" src="/static/banner_2_200x40.png" />
            <span className="banner-caption">（小サイズ：200×40ピクセル）</span>
          </div>
        </p>
      </TextBlock>
    </section>
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

export const SectionHeader: React.FC<{
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
    <small>{en}</small>{children}
  </h2>
}
