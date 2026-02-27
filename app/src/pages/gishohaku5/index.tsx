/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import Image from 'next/image'
import { media, colors } from '../../utils/style'
import TextBlock from '../../components/atoms/TextBlock'
import SectionHeader from '../../components/SectionHeder'
import placeIcon from '../../components/top/round-place.svg'
import directionsIcon from '../../components/top/round-directions_run.svg'

const keyColor = colors.primaryDarker

const LinkButton: React.FC<{
  href: string
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
    href={href}
    className={className}>
    {children}
  </a>
)

const Hero = () => (
  <div
    css={css`
      background-color: #edefe8;
      margin-top: -66px;
      padding: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 66px;
      padding-bottom: 24px;

      color: white;
      color: #1c3559;
      /* background-image: url('/static/bg.png'); */
      @media ${media.large} {
        flex-direction: column;
        padding: ${66}px 16px 16px;
        align-items: start;
      }
    `}>
    <div className="mx-auto lg:mx-0 px-4">
      <Image width={400} height={400} src="/static/gishohaku5-logo.png" />
    </div>
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
        2021.06.19 <small>Sat. 11:00~16:00</small>
      </div>
      <div
        css={css`
          font-size: 20px;
          font-weight: bold;
          @media ${media.large} {
            font-size: 16px;
          }
        `}>
        @大田区産業プラザPiO 1F 大展示ホール
      </div>
      <div
        css={css`
          margin-top: 16px;
          .btn-green {
            border: 2px solid #00c79a;
            background-color: #00c79a;
            color: #edefe8;
            &:hover {
              background-color: #edefe8;
              color: #00c79a;
            }
          }
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
        <LinkButton
          href="#market"
          className="btn-blue">
          オンラインマーケット
        </LinkButton>
        <LinkButton href={`/gishohaku5/circles`} className="btn-green">
          出展サークルを確認
        </LinkButton>
      </div>
    </div>
  </div>
)

const Award: React.FC<{
  title: string
  book: string
  circle: string
  image: string
  bookref: string
  circleref: string
}> = ({ title, book, circle, image, bookref, circleref }) => {
  return (
    <div
      css={css`
        display: block;
        width: 300px;
        text-align: center;
        margin: 8px;
      `}>
      <div
        css={css`
          width: 300px;
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
          href={bookref || 'javascript:void(0);'}
          css={css`
            padding: 12px;
            text-align: center;
            display: block;
          `}
          rel="noopener">
          <img
            css={css`
              max-width: 200px;
              max-height: 240px;
              margin: 0 auto;
            `}
            src={image}
          />
        </a>
      </div>
      <div
        css={css`
          font-size: 12px;
          margin-top: 8px;
          margin-bottom: 4px !important;
          line-height: 1.4;
          opacity: 0.8;
        `}>{title}</div>
      <div
        css={css`
          font-size: 15px;
          font-weight: bold;
          line-height: 1.5;
          margin-bottom: 4px;
        `}>
        <a
          css={css`
            text-decoration: none;
            color: #1d272d;
          `}
          href={bookref || 'javascript:void(0);'}
          rel="noopener">
          {book}
        </a>
      </div>
      <div
        css={css`
          font-size: 15px;
          line-height: 1.5;
        `}>
        <a
          css={css`
            text-decoration: none;
            color: #1d272d;
          `}
          href={circleref || 'javascript:void(0);'}
          rel="noopener">
          {circle}
        </a>
      </div>
    </div>
  )
}

const Sponsor: React.FC<{
  image: string
  name: string
  role: string
  href: string
}> = ({ image, name, role, href }) => {
  return (
    <div
      css={css`
        display: block;
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

const Staff: React.FC<{
  name: string
  imageUrl: string
  twitter: string
}> = ({ name, imageUrl, twitter }) => {
  return (
    <div
      css={css`
        display: block;
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

const Printing: React.FC<{
  name: string
  imageUrl: string
  linkUrl: string
}> = ({ name, imageUrl, linkUrl }) => {
  return (
    <div
      css={css`
        display: block;
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
    background-color: #edefe8;
  }
`

const Page = () => {
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
            <LinkButton href="https://gishohaku.booth.pm/items/3044913">
              公式ガイドブックを無料ダウンロード
            </LinkButton>
          </p>
        </TextBlock>
      </section>
      <section css={section} id='market'>
        <SectionHeader en="MARKET">オンライン参加 / マーケット</SectionHeader>
        <TextBlock>
          <p>
            技書博関連の頒布物を各社のオンラインマーケット上でもご購入いただけます。
            <br />
            以下のバナーよりご覧ください！
            <br />
          </p>
          <div
            css={css`
              text-align: center;
              .banner {
                display: block;
                max-width: 100%;
                border: 1px solid #ddd;
                margin: 0 auto;
              }
              .banner-outer {
                text-align: center;
                display: block;
                margin: 8px 0;
              }
              .banner-caption {
                font-size: 12px;
                color: #888;
              }
            `}>
            <div className="banner-outer">
              <a
                target="_blank"
                href="https://ecs.toranoana.jp/tora/ec/cot/pages/all/item/2021/06/19/00001/">
                <img
                  className="banner"
                  src="/static/printings/toranoana.gif"
                />
              </a>
            </div>
            <div className="banner-outer">
              <a target="_blank" href="https://booth.pm/ja/events/gishohaku5">
                <img
                  className="banner"
                  src="/static/printings/booth.png"
                />
              </a>
            </div>
          </div>
        </TextBlock>
      </section>

      <section css={section}>
        <SectionHeader en="AWARD">技書博アワード</SectionHeader>
        <TextBlock>
          <div
            css={css`
              text-align: center;
            `}>
            <div
              css={css`
                font-size: 18px;
                font-weight: bold;
              `}>
              <a href="https://www.wantedly.com/companies/apcommunications/post_articles/332306">インフラエンジニアBooksアワード2021＠技書博5</a>
            </div>
            <div
              css={css`
                font-size: 12px;
                color: #888888;
              `}>
              Presented by <a href="https://www.ap-com.co.jp/" target="_blank">株式会社エーピーコミュニケーションズ</a>
            </div>
            <div
              css={css`
                text-align: center;
                .awardlist {
                  display: flex;
                  flex-flow: row wrap;
                  justify-content: center;
                  align-content: flex-start;
                  align-items: flex-start;
                  margin: 12px 0;
                }
              `}>
              <div className="awardlist">
                <Award
                  title="最優秀賞"
                  book="ハラククリカタ"
                  circle="誰も知らない出版（Growthfaction）"
                  image="/static/awards/gishohaku5-award-best.png"
                  bookref="/gishohaku5/books/acsxsD0Xh6Tz6RN1LQ44"
                  circleref="/gishohaku5/circles/LEbxPS8epJw9DpdkH4kX"
                />
                <Award
                  title="優秀賞"
                  book="HACK OR DIE 1～4"
                  circle="GATOMICARISE"
                  image="/static/awards/gishohaku5-award-excellence.png"
                  bookref="/gishohaku5/books/UCnDS4icsNzoXxsjEDsn"
                  circleref="/gishohaku5/circles/01yNsExFLe0hkwTidLMs"
                />
              </div>
            </div>
          </div>
        </TextBlock>
      </section>

      <section css={section}>
        <SectionHeader en="RADIO">技書博ラジオ 直前スペシャル</SectionHeader>
        <TextBlock>
          <p>
            技書博開催の直前に配信された、全サークルを紹介するラジオ番組です。
            <br />
          </p>
          <div
            css={css`
              margin-top: 32px;
              text-align: center;
              position: relative;
              width: 100%;
              height: 0;
              padding-bottom: 56.25%;
              overflow: hidden;
              margin-bottom: 50px;
            `}>
            <iframe
              css={css`
                border: 0;
                height: 100%;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
              `}
              src="https://www.youtube.com/embed/MukacNr759M?controls=0"
              title="技書博ラジオ 技書博5直前スペシャル"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen></iframe>
          </div>
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
              min-height: 320px;
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
              <Sponsor
                name="テクノブレーン株式会社"
                role="サポーター"
                image="/static/sponsors/technobrain.png"
                href="https://www.techno-brain.co.jp/"
              />
            </div>
            <div className="sponsorlist">
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
              imageUrl="/static/printings/shimaya.png"
              linkUrl="https://www.shimaya.net/"
            />
            <Printing
              name="ねこのしっぽ"
              imageUrl="/static/printings/neko.gif"
              linkUrl="https://www.shippo.co.jp/neko/"
            />
            <Printing
              name="日光企画"
              imageUrl="/static/printings/nikko.png"
              linkUrl="https://www.nikko-pc.com/"
            />
            <Printing
              name="栄光"
              imageUrl="/static/printings/eikou.gif"
              linkUrl="http://www.eikou.com/"
            />
            <Printing
              name="PICO"
              imageUrl="/static/printings/pico.gif"
              linkUrl="http://www.pico-net.com/doujinshi/"
            />
            <Printing
              name="PrintWalk"
              imageUrl="/static/printings/printwalk.jpg"
              linkUrl="https://www.print-walk.co.jp/"
            />
            <Printing
              name="K-9"
              imageUrl="/static/printings/k9.gif"
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
              imageUrl="/static/staffs/ariaki.png"
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
              name="かめねこ"
              imageUrl="https://storage.googleapis.com/jump/kameneko_icon.jpg"
              twitter="https://twitter.com/kameneko1004"
            />
            <Staff
              name="Alice_You"
              imageUrl="https://pbs.twimg.com/profile_images/192706028/withmona_400x400.jpg"
              twitter="https://twitter.com/Alice_You"
            />
            <Staff
              name="にしこさん"
              imageUrl="https://pbs.twimg.com/profile_images/1351110571513565192/NQ0ZcB8P_400x400.jpg"
              twitter=""
            />
            <Staff
              name="KANE"
              imageUrl="https://pbs.twimg.com/profile_images/1066541445543276544/zHx_piIh_400x400.jpg"
              twitter=""
            />
            <Staff
              name="なべくら"
              imageUrl="/static/staffs/nabekura.jpg"
              twitter=""
            />
            <Staff
              name="さんじょう"
              imageUrl="/static/staffs/sanjo.jpg"
              twitter=""
            />
            <Staff
              name="ごまなつ"
              imageUrl="/static/staffs/gomanatsu.jpg"
              twitter=""
            />
            <Staff name="いまい" imageUrl="" twitter="" />
            <Staff
              name="ふーれむ"
              imageUrl="https://pbs.twimg.com/profile_images/1647040005/screenshot_01_400x400.jpg"
              twitter=""
            />
            <Staff
              name="みなみん"
              imageUrl="/static/staffs/shimamino.png"
              twitter=""
            />
            <Staff
              name="梅林良太"
              imageUrl="/static/staffs/umebayashi.jpg"
              twitter=""
            />
            <Staff
              name="けるびん"
              imageUrl="/static/staffs/kerubin.png"
              twitter=""
            />
            <Staff name="くろす" imageUrl="" twitter="" />
            <Staff name="もつ" imageUrl="/static/staffs/motsu.jpg" twitter="" />
            <Staff
              name="木檜和明"
              imageUrl="https://l-w-i.net/img/profile_480.jpg"
              twitter=""
            />
            <Staff name="室谷優" imageUrl="" twitter="" />
            <Staff name="alwehf" imageUrl="" twitter="" />
            <Staff
              name="ほげさん"
              imageUrl="https://pbs.twimg.com/profile_images/701081366645993472/qHYp5OwX_400x400.jpg"
              twitter=""
            />
            <Staff name="けい酸ネコ" imageUrl="" twitter="" />
            <Staff
              name="えがら"
              imageUrl="/static/staffs/egara.jpg"
              twitter=""
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
          <div
            css={css`
              text-align: center;
              .banner {
                display: block;
                max-width: 100%;
                border: 1px solid #ddd;
                margin: 0 auto;
              }
              .banner-outer {
                text-align: center;
                display: block;
                margin: 8px 0;
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
          </div>
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

export default Page
