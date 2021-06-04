/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { media, colors } from '../../utils/style'
import TextBlock from '../../components/atoms/TextBlock'
import SectionHeader from '../../components/SectionHeder'
import placeIcon from '../../components/top/round-place.svg'
import directionsIcon from '../../components/top/round-directions_run.svg'

const keyColor = colors.primaryDarker

const LinkButton: React.SFC<{
  href: string
}> = ({ href, children }) => (
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
    href={href}>
    {children}
  </a>
)

const Hero = () => (
  <div
    css={css`
      background: linear-gradient(
        180deg,
        #cce0ff 0%,
        rgba(208, 224, 249, 0.791667) 40%,
        rgba(255, 255, 255, 100) 100%
      );
      margin-top: -66px;
      padding: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 66px;
      padding-bottom: 0;

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
        @media ${media.large} {
          width: 280px;
          margin: 0 auto 20px;
          left: 0;
          height: auto;
        }
      `}
      src="https://img.esa.io/uploads/production/attachments/13039/2019/11/19/4651/01cecbd6-0b7e-4369-93f3-17ac06fb7402.png"
      width={280}
      height={286}
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
        <small>第五回</small>技術書同人誌博覧会
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
        2021.06.19 <small>Sat. 11:00~17:00</small>
      </div>
      <div
        css={css`
          font-size: 20px;
          font-weight: bold;
          @media ${media.large} {
            font-size: 16px;
          }
        `}>
        @大田区産業プラザPiO
      </div>
      <div
        css={css`
          margin-top: 16px;
        `}>
        <LinkButton href="https://blog.https://passmarket.yahoo.co.jp/event/show/detail/01p1tn197jn11.html.dev/entry/gishohaku2-attend">
          一般参加申込はこちら
        </LinkButton>
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
        width: 220px;
        text-align: center;
        margin: 8px;
      `}>
      <div
        css={css`
          border: 1px solid #eee;
          background-color: white;
          width: 200px;
          height: 200px;
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
          <p
            css={css`
              margin-top: 32px;
              text-align: center;
              a {
                margin: 8px 16px;
              }
            `}>
            <LinkButton href="https://gishohaku.booth.pm/items/1712299">
              公式ガイドブックを無料ダウンロードする
            </LinkButton>
          </p>
        </TextBlock>
      </section>
      <section css={section}>
        <SectionHeader en="TICKET">チケット申込</SectionHeader>
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
            <LinkButton href="https://blog.https://passmarket.yahoo.co.jp/event/show/detail/01p1tn197jn11.html.dev/entry/gishohaku2-attend">
              一般参加申込はこちら
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
              東京都大田区南蒲田1丁目20-20（
              <a target="_blank" href="https://goo.gl/maps/XbFMHBcGqiHEPmmE9">
                Google マップ
              </a>
              ）
            </p>
            <p css={withIcon}>
              <img src={directionsIcon} alt="アクセス" />
              京浜急行「京急蒲田」駅より徒歩約3分
              <br />
              JR京浜東北線、東急池上・多摩川線「蒲田」駅より徒歩約13分
              <br />
            </p>
          </div>
          <iframe
            css={css`
              width: 100%;
              min-height: 240px;
            `}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3245.794138856147!2d139.72187801537484!3d35.55878604428462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601860f87f5da4e3%3A0x8a0493a2f4accfb0!2z5aSn55Sw5Yy655Sj5qWt44OX44Op44K2UGlP!5e0!3m2!1sja!2sjp!4v1622789832134!5m2!1sja!2sjp"></iframe>
        </TextBlock>
      </section>
      {/* <Sections /> */}
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
                name="インフラエンジニアBooks"
                role="サポーター"
                image="/static/sponsors/infraengbooks.png"
                href="https://infra-eng-books.connpass.com/"
              />
              <Sponsor
                name="エンジニアフレンドリーシティ福岡"
                role="サポーター"
                image="/static/sponsors/fukuoka.png"
                href="https://efc.fukuoka.jp/"
              />
              <Sponsor
                name="株式会社セレマアシスト"
                role="サポーター"
                image="/static/sponsors/thelemaassist.png"
                href="https://thelemaassist.com/"
              />
            </div>
            <div className="sponsorlist">
              <Sponsor
                name="テクノブレーン株式会社"
                role="サポーター"
                image="/static/sponsors/technobrain.jpg"
                href="https://www.techno-brain.co.jp/"
              />
              <Sponsor
                name="株式会社メディアドゥ"
                role="サポーター"
                image="/static/sponsors/mediado.png"
                href="https://mediado.jp/"
              />
            </div>
            <div className="sponsorlist">
              <Sponsor
                name="株式会社しまや出版"
                role="プリンティングサポーター"
                image="/static/sponsors/shimaya.png"
                href="https://www.shimaya.net/"
              />
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
            </div>
          </div>
        </TextBlock>
      </section>
      <section css={section}>
        <SectionHeader en="PRINTING">バックアップ印刷所</SectionHeader>
        <TextBlock>
          <div
            css={css`
              display: flex;
              flex-flow: row wrap;
              justify-content: center;
              align-content: flex-start;
              align-items: flex-start;
            `}>
            <Printing
              name="しまや出版"
              imageUrl="https://gishohaku.dev/static/printings/shimaya.png"
              linkUrl="https://www.shimaya.net/"
            />
            <Printing
              name="ねこのしっぽ"
              imageUrl="https://www.shippo.co.jp/neko/img/neko_banner.gif"
              linkUrl="https://www.shippo.co.jp/neko/"
            />
            <Printing
              name="日光企画"
              imageUrl="https://www.nikko-pc.com/start/logo.gif"
              linkUrl="https://www.nikko-pc.com/"
            />
            <Printing
              name="ポプルス"
              imageUrl="http://www.inv.co.jp/~popls/sozai/poplsbn2.gif"
              linkUrl="http://www.inv.co.jp/~popls/"
            />
            <Printing
              name="栄光"
              imageUrl="https://www.eikou.com/link/eikoubanner.gif"
              linkUrl="http://www.eikou.com/"
            />
            <Printing
              name="PICO"
              imageUrl="https://www.pico-net.com/topmenu/pico_bunner.gif"
              linkUrl="http://www.pico-net.com/doujinshi/"
            />
            <Printing
              name="PrintWalk"
              imageUrl="http://www.print-walk.co.jp/links/images/banner02.gif"
              linkUrl="http://www.print-walk.co.jp/"
            />
            <Printing
              name="K-9"
              imageUrl="https://www.k-k9.jp/wp-content/themes/k9_20160801/img/logo.gif"
              linkUrl="https://www.k-k9.jp/"
            />
          </div>
        </TextBlock>
      </section>
      <section css={section}>
        <SectionHeader en="TEAM">チーム</SectionHeader>
        <TextBlock>
          <div
            css={css`
              display: flex;
              flex-flow: row wrap;
              justify-content: center;
              align-content: flex-start;
              align-items: flex-start;
            `}>
            <Staff
              name="ariaki"
              imageUrl="https://pbs.twimg.com/profile_images/941464951406940160/lHEop40U_400x400.jpg"
              twitter="https://twitter.com/ariaki4dev"
            />
            <Staff
              name="水殿"
              imageUrl="https://pbs.twimg.com/profile_images/1071222075501629442/bAQUfeke_400x400.jpg"
              twitter="https://twitter.com/midono_ap1"
            />
            <Staff
              name="おやかた"
              imageUrl="https://pbs.twimg.com/profile_images/893588120666480640/i-kZmS-f_400x400.jpg"
              twitter="https://twitter.com/oyakata2438"
            />
            <Staff
              name="kurakake"
              imageUrl="https://i.gyazo.com/0ef049e049c0b0587db07c79c0c373ff.jpg"
              twitter="https://twitter.com/kurakake"
            />
            <Staff
              name="なのなの"
              imageUrl="https://pbs.twimg.com/profile_images/926635106860535808/lQbUVyz1.jpg"
              twitter="https://twitter.com/nano2_aloerina"
            />
            <Staff
              name="くりまお"
              imageUrl="https://img.esa.io/uploads/production/attachments/13039/2019/11/19/44748/4e9b3331-25b8-4b2e-ab7a-0182d520950c.png"
              twitter="https://twitter.com/awa_kuri23"
            />
            <Staff
              name="なつお"
              imageUrl="https://pbs.twimg.com/profile_images/1163733716625084417/rKHB3a6M_400x400.png"
              twitter="https://twitter.com/KazuyaNakahara"
            />
            <Staff
              name="mottox2"
              imageUrl="https://avatars1.githubusercontent.com/u/7007253?s=460&v=4"
              twitter="https://twitter.com/mottox2"
            />
            <Staff
              name="こまっち"
              imageUrl="https://pbs.twimg.com/profile_images/1129052243204816899/-ncXI3sj_400x400.jpg"
              twitter="https://twitter.com/komacchi_u"
            />
            <Staff
              name="たろすけ"
              imageUrl="https://pbs.twimg.com/profile_images/1168150305600524289/YCACfoXk_400x400.jpg"
              twitter="https://twitter.com/tarosuke777000"
            />
            <Staff
              name="かめねこ"
              imageUrl="https://storage.googleapis.com/jump/kameneko_icon.jpg"
              twitter="https://twitter.com/kameneko1004"
            />
            <Staff
              name="Alice_You"
              imageUrl="https://pbs.twimg.com/profile_images/192706028/withmona_400x400.jpg"
              twitter="https://twitter.com/Alice_You"
            />
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
              <img className="banner" src="/static/banner_2_600x120.png" />
              <span className="banner-caption">
                （大サイズ：600×120ピクセル）
              </span>
            </div>
            <div className="banner-outer">
              <img className="banner" src="/static/banner_2_200x40.png" />
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
