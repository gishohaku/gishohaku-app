/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import Image from 'next/image'
import { media, colors } from '../utils/style'
import FluidBlock from '../components/atoms/FluidBlock'
import TextBlock from '../components/atoms/TextBlock'
import SectionHeader from '../components/SectionHeder'
import placeIcon from '../components/top/round-place.svg'
import directionsIcon from '../components/top/round-directions_run.svg'

const keyColor = colors.primaryDarker

const LinkButton: React.SFC<{
  href: string,
  className?: string
}> = ({ href, children, className }) => (
  <a
    css={css`
      font-size: 16px;
      border: 2px solid #81b4c5;
      color: #81b4c5;
      font-weight: bold;
      padding: 10px 16px;
      display: inline-block;
      text-decoration: none;
      border-radius: 4px;
      margin-right: 8px;
      min-width: 200px;
      text-align: center;
      transition: all 0.1s ease-out;
      @media ${media.large} {
        margin: 8px 0 0;
        display: block;
      }
      &:hover {
        background-color: #81b4c5;
        color: white;
      }
    `}
    target="_blank"
    rel="noopener"
    href={href}
    className={className}>
    {children}
  </a>
)

const Hero = () => (
  <div>
  <div
    css={css`
      background-color: #f2f7f9;
      margin-top: 10px;
      padding: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 66px;
      padding-bottom: 66px;

      color: white;
      color: #81b4c5;
      /* background-image: url('/static/bg.png'); */
      @media ${media.large} {
        flex-direction: column;
        padding: ${66}px 16px 16px;
        align-items: start;
      }
    `}>
    

    <img
      css={css`
        width: 400px;
        position: relative;
        left: -10px;
        height: 370px;
        border: 1px solid #d5d7d0;
        @media ${media.large} {
          width: 280px;
          margin: 0 auto 20px;
          left: 0;
          height: auto;
        }
      `}
      src="/static/gishohaku9-logo.png"
      width={280}
      height={280}
    />
    <div
      css={css`
        margin-left: 32px;
        position: relative;
        top: -8px;
        @media ${media.large} {
          margin-left: 0;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          top: 0;
        }
      `}>
      <h1
        css={css`
          font-size: 30px;
          font-weight: bold;
          display: flex;
          align-items: center;
          small {
            font-size: 18px;
            background-color: white;
            background-color: #81b4c5;
            color: white;
            display: inline-block;
            padding: 2px 10px;
            margin-right: 8px;
            border-radius: 4px;
          }
          @media ${media.large} {
            font-size: 24px;
            small {
              font-size: 16px;
            }
          }
        `}>
        <small>第九回</small>技術書同人誌博覧会
      </h1>
      <div
        css={css`
          margin-top: 8px;
          font-size: 36px;
          font-weight: 500;
          font-family: 'Poppins', sans-serif;
          line-height: 1.2;
          small {
            font-size: 24px;
          }
          @media ${media.large} {
            font-size: 28px;
          }
        `}>
        2023.11.25 <small>Sut. 11:00~16:00</small>
      </div>
      <div
        css={css`
          font-size: 20px;
          font-weight: bold;
          @media ${media.large} {
            font-size: 16px;
          }
        `}>
        @大田区産業プラザPiO 大展示ホール
      </div>
      <div
        css={css`
          margin-top: 16px;
          margin-bottom: 16px;
          a {
            border: 2px solid #81b4c5;
            background-color: #81b4c5;
            color: #f2f7f9;
            &:hover {
              background-color: #f2f7f9;
              color: #81b4c5;
            }
          }
        `}>
        <LinkButton href="/circle-entry">
          サークル申込
        </LinkButton>
        <LinkButton href="https://blog.gishohaku.dev/entry/2023/08/10/135926">
          協賛のご案内
        </LinkButton>
      </div>
    </div>
  </div>
  </div>
)

const Sponsor: React.SFC<{
  image: string
  name: string
  role: string
  href: string
}> = ({ image, name, role, href }) => {
  return (
    <div
      css={css`
        display: flex-item;
        width: 240px;
        text-align: center;
        margin: 8px;
      `}>
      <div
        css={css`
          border: 1px solid #eee;
          background-color: white;
          width: 220px;
          height: 220px;
          margin: 0 auto;
          display: -webkit-flex;
          display: flex;
          text-align: center;
          -webkit-align-items: center;
          align-items: center;
          -webkit-justify-content: center;
          justify-content: center;
        `}>
        <a
          href={href || 'javascript:void(0);'}
          css={css`
            padding: 12px;
            text-align: center;
            display: block;
          `}
          target="_blank"
          rel="noopener">
          <img
            css={css`
              max-width: 170px;
              max-height: 160px;
              margin: 0 auto;
            `}
            src={image}
          />
        </a>
      </div>
      <p
        css={css`
          font-size: 12px;
          margin-top: 8px;
          margin-bottom: 4px !important;
          line-height: 1.4;
          opacity: 0.8;
        `}
        dangerouslySetInnerHTML={{
          __html: role.replace(/・/g, '・<br />'),
        }}></p>
      <p
        css={css`
          font-size: 15px;
          font-weight: bold;
          line-height: 1.5;
        `}>
        <a
          css={css`
            text-decoration: none;
            color: #1d272d;
          `}
          href={href}
          target="_blank"
          rel="noopener">
          {name}
        </a>
      </p>
    </div>
  )
}

const Staff: React.SFC<{
  name: string
  imageUrl: string
  twitter: string
}> = ({ name, imageUrl, twitter }) => {
  return (
    <div
      css={css`
        display: flex-item;
        width: 96px;
        text-align: center;
        margin: 12px;
        img {
          margin: 0 auto;
          border: 1px solid #eee;
          border-radius: 50% !important;
        }
        @media ${media.small} {
          width: 72px;
          margin: 6px;
        }
      `}>
      {twitter ? (
        <a target="_blank" rel="noopener" href={twitter}>
          <img src={imageUrl || '/static/gishohaku_gray.png'} />
        </a>
      ) : (
        <img src={imageUrl || '/static/gishohaku_gray.png'} />
      )}
      <p
        css={css`
          font-size: 12px;
          margin-top: 6px;
          line-height: 1.4;
          opacity: 0.8;
        `}>
        {name}
      </p>
    </div>
  )
}

const Printing: React.SFC<{
  name: string
  imageUrl: string
  linkUrl: string
}> = ({ name, imageUrl, linkUrl }) => {
  return (
    <div
      css={css`
        display: flex-item;
        width: 200px;
        text-align: center;
        margin: 16px;
        img {
          margin: 0 auto;
          max-width: 200px;
          max-height: 40px;
        }
      `}>
      <a target="_blank" rel="noopener" href={linkUrl}>
        <img src={imageUrl} />
      </a>
      <p
        css={css`
          font-size: 12px;
          margin-top: 6px;
          line-height: 1.4;
          opacity: 0.8;
        `}>
        {name}
      </p>
    </div>
  )
}

const section = css`
  padding: 48px 0;
  background-color: white;
  @media ${media.large} {
    padding: 32px 0;
  }
  :nth-child(odd) {
    background-color: #f7f8fa;
  }
`

export default () => {
  return (
    <>
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
      <section css={section}>
        <SectionHeader en="ACCESS">アクセス</SectionHeader>
        <TextBlock>
          <p
            css={css`
              font-size: 24px;
              font-weight: bold;
              @media ${media.small} {
                font-size: 24px;
              }
            `}>
            大田区産業プラザPiO 大展示ホール
          </p>
          <div
            css={css`
              background-color: #fff;
              padding: 12px;
              border-radius: 4px;
              margin-top: 8px;
            `}>
            <p css={withIcon}>
              <img src={placeIcon} alt="住所" />
              東京都大田区南蒲田1-20-20（
              <a target="_blank" href="https://goo.gl/maps/2J282yVtzG3T5f398">
                Google マップ
              </a>
              ）
            </p>
            <p css={withIcon}>
              <img src={directionsIcon} alt="アクセス" />
              京浜急行「京急蒲田」駅東口より徒歩約3分
            </p>
          </div>
        </TextBlock>
        <FluidBlock>
          <iframe
            css={css`
              width: 100%;
              min-height: 420px;
            `}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3245.7943158893236!2d139.72149177618968!3d35.55878167262698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601860f87f5da4e3%3A0x8a0493a2f4accfb0!2z5aSn55Sw5Yy655Sj5qWt44OX44Op44K2UGlP!5e0!3m2!1sja!2sjp!4v1686285144204!5m2!1sja!2sjp"></iframe>
        </FluidBlock>
      </section>

      <section css={section}>
        <SectionHeader en="BANNER">リンクバナー</SectionHeader>
        <TextBlock>
          <p
            css={css`
              text-align: center;
            `}>
            当サイトへのリンクを掲載いただく際は、以下のバナーをご利用ください。
          </p>
          <p
            css={css`
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
              <img className="banner" src="/static/banner_600x120.png" />
              <span className="banner-caption">
                （大サイズ：600×120ピクセル）
              </span>
            </div>
            <div className="banner-outer">
              <img className="banner" src="/static/banner_200x40.png" />
              <span className="banner-caption">
                （小サイズ：200×40ピクセル）
              </span>
            </div>
          </p>
        </TextBlock>
      </section>
    </>
  )
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
