/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import Image from 'next/image'
import { media, colors } from '../utils/style'
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
      border: 2px solid #1c3559;
      color: #1c3559;
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
        background-color: #1c3559;
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
      background-color: #edefe8;
      margin-top: 10px;
      padding: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 66px;
      padding-bottom: 66px;

      color: white;
      color: #1c3559;
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
      src="/static/gishohaku7-logo.png"
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
            background-color: #1c3559;
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
        <small>第七回</small>技術書同人誌博覧会
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
        2022.11.20 <small>Sun. 11:00~16:00</small>
      </div>
      <div
        css={css`
          font-size: 20px;
          font-weight: bold;
          @media ${media.large} {
            font-size: 16px;
          }
        `}>
        @東京都産業貿易センター 台東館 7F
      </div>
      <div
        css={css`
          margin-top: 16px;
          .btn-blue {
            border: 2px solid #009ac7;
            background-color: #009ac7;
            color: #edefe8;
            &:hover {
              background-color: #edefe8;
              color: #009ac7;
            }
          }
        `}>
        <LinkButton href="https://passmarket.yahoo.co.jp/event/show/detail/01mn55v7g5p21.html">
          来場予約はこちら
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
        <SectionHeader en="ENTRY">一般来場予約</SectionHeader>
        <TextBlock>
          <p>
            技書博本編に来場される際には、事前予約（無料）が必要です。<br />
            時間指定制になりますので、券面に表記された時間以外は入場頂けません。<br />
            必ず事前にチケットをお求めのうえ、ご参加ください。<br />
          </p>
          <p
            css={css`
              font-size: 14px;
              margin-top: 32px;
              text-align: center;
              a {
                margin: 8px 16px;
              }
            `}>
            <LinkButton href="https://passmarket.yahoo.co.jp/event/show/detail/01mn55v7g5p21.html">
              来場予約はこちら
            </LinkButton>
            <LinkButton href="https://passmarket.yahoo.co.jp/event/show/detail/01ikpjr40pp21.html">
              懇親会予約はこちら
            </LinkButton>
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
            東京都産業貿易センター 台東館 7階展示室
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
              東京都台東区花川戸2-6-5（
              <a target="_blank" href="https://goo.gl/maps/uhe7NUtw36Vz5yAQ8">
                Google マップ
              </a>
              ）
            </p>
            <p css={withIcon}>
              <img src={directionsIcon} alt="アクセス" />
              東京メトロ 銀座線・東武伊勢崎線「浅草」駅より徒歩約5分
              <br />
              都営浅草線「浅草」駅より徒歩約8分
              <br />
              つくばエクスプレス「浅草」駅より徒歩約9分
              <br />
              都営バス「二天門」下車すぐ前
            </p>
          </div>
          <iframe
            css={css`
              width: 100%;
              min-height: 240px;
            `}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.4783797179557!2d139.79658031549522!3d35.714451780186536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188ec3d981d0f5%3A0x82b2ec9f4699aec6!2z5p2x5Lqs6YO956uL55Sj5qWt6LK_5piT44K744Oz44K_44O8IOWPsOadsemkqA!5e0!3m2!1sja!2sjp!4v1637550055034!5m2!1sja!2sjp"></iframe>
        </TextBlock>
      </section>

      <section css={section}>
        <SectionHeader en="SPONSOR">スポンサー</SectionHeader>
        <TextBlock>
          <div
            css={css`
              text-align: center;
              .sponsorlist {
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
                align-content: flex-start;
                align-items: flex-start;
                margin: 12px 0;
              }
            `}>
            <div className="sponsorlist">
              <Sponsor
                name="株式会社システムアイ"
                role="アワードサポーター"
                image="/static/sponsors/systemi.png"
                href="https://systemi.co.jp/"
              />
              <Sponsor
                name="エンジニアフレンドリーシティ福岡"
                role="サポーター"
                image="/static/sponsors/fukuoka.png"
                href="https://efc.fukuoka.jp/"
              />
              <Sponsor
                name="さくらインターネット株式会社"
                role="サポーター"
                href="https://www.sakura.ad.jp/"
                image="/static/sponsors/sakura.png"
              />
            </div>
            <div className="sponsorlist">
              <Sponsor
                name="株式会社セレマアシスト"
                role="サポーター"
                image="/static/sponsors/thelemaassist.png"
                href="https://thelemaassist.com/"
              />
              <Sponsor
                name="熱海怪獣映画祭"
                role="怪獣サポーター"
                image="/static/sponsors/atamikaiju.png"
                href="https://atamikaiju.jp/"
              />
              <Sponsor
                name="株式会社しまや出版"
                role="プリンティングサポーター"
                image="/static/sponsors/shimaya.png"
                href="https://www.shimaya.net/"
              />
            </div>
            <div className="sponsorlist">
              <Sponsor
                name="esa"
                role="ツールサポーター"
                image="/static/sponsors/esa.png"
                href="https://esa.io"
              />
              <Sponsor
                name="ImageFlux"
                role="ツールサポーター"
                image="/static/sponsors/imageflux.png"
                href="https://www.sakura.ad.jp/services/imageflux/"
              />
              <Sponsor
                name="株式会社野村総合研究所"
                role="ツールサポーター"
                image="/static/sponsors/nri.png"
                href="https://aslead.nri.co.jp/products/miro/"
              />
            </div>
          </div>
        </TextBlock>
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
