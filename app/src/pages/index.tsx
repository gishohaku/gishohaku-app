/** @jsx jsx */
import { css, jsx } from '@emotion/core'
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
      border: 2px solid #364493;
      color: #364493;
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
        background-color: #364493;
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
      color: #364493;
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
      src="/static/gishohaku12-logo.png"
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
            background-color: #364493;
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
        <small>第十二回</small>技術書同人誌博覧会
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
        2025.10.26 <small>Sun. 10:30~16:00</small>
      </div>
      <div
        css={css`
          font-size: 20px;
          font-weight: bold;
          @media ${media.large} {
            font-size: 16px;
          }
        `}>
        @大宮ソニックシティ
      </div>
      <div
        css={css`
          margin-top: 16px;
          margin-bottom: 16px;
          a {
            border: 2px solid #364493;
            color: #364493;
            &:hover {
              background-color: #364493;
              color: white;
            }
          }
        `}>
        <LinkButton href="https://gishohaku.connpass.com/event/352601/">
          技書博12にサークル参加する
        </LinkButton>
        <LinkButton href="https://gishohaku.connpass.com/event/352601/">
          技書博12に一般参加する（無料）
        </LinkButton>
      </div>
    </div>
  </div>
  </div>
)

const Award: React.SFC<{
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
        display: flex-item;
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

const Sponsor: React.SFC<{
  image: string
  name: string
  role: string
  href: string
}> = ({ image, name, role, href }) => {
  return (
    <div
      className="sponsor"
      css={css`
        display: flex-item;
        width: 240px;
        text-align: center;
        margin: 8px;
        filter: drop-shadow(1px 3px 3px rgba(0, 0, 0, 0.1));
      `}>
      <div
        className="sponsor-image"
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
          技術書同人誌博覧会（技書博）は、技術に関する同人誌の即売会です。ITの他に、理工/数学/デザイン/マネジメントなど幅広い技術を取り扱っています。エンジニアのアウトプットを応援したい＆増やしたいという思いからこのイベントが生まれました。初心者にもベテランにも優しく、ゆったりと交流しながら知識を深め、仲間を作ったり成長できるような場所を目指しています。
          （<a target="_blank" href="https://blog.gishohaku.dev/entry/about">もっとくわしい説明はこちら</a>）
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
            ソニックシティ
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
              埼玉県さいたま市大宮区桜木町1-7-5（
              <a target="_blank" href="https://maps.app.goo.gl/YySEtAYeVX137UoQA">
                Google マップ
              </a>
              ）
            </p>
            <p css={withIcon}>
              <img src={directionsIcon} alt="アクセス" />
              JR「大宮駅」西口より徒歩約3分
            </p>
          </div>
        </TextBlock>
        <FluidBlock>
          <iframe
            css={css`
              width: 100%;
              min-height: 420px;
            `}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.211032162132!2d139.6171346760428!3d35.90526951763406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018c14334b5b89f%3A0x1f5fecd47f68d7f1!2z44K944OL44OD44Kv44K344OG44Kj!5e1!3m2!1sja!2sjp!4v1744762942967!5m2!1sja!2sjp"></iframe>
        </FluidBlock>
      </section>

      <section css={section}>
      <SectionHeader en="CIRCLE">サークル参加者への案内</SectionHeader>
        <TextBlock>
          <p>
            サークル参加される方に向けたご案内資料です。
          </p>
          <LinkButton href="https://gishohaku.notion.site/">
            技書博ポータル
            <small>（サークル向けの手続き案内・諸情報）</small>
          </LinkButton>
        </TextBlock>
      </section>

      <section css={section}>
        <SectionHeader en="SPONSOR">スポンサー</SectionHeader>
        <TextBlock>
          <p>
            技書博は協賛企業さまのご支援によって運営を継続させて頂いております。<br />
            スポンサーメニューをご確認いただき、お申し込みくださいますと幸いです。<br />
          </p>
          <LinkButton href="https://docs.google.com/presentation/d/1S0qzmFl3pV6w3IC4S1dFS4wdy17L7q35YrbE30hz4iE/edit?usp=sharing">
            スポンサーメニューを確認する
          </LinkButton>

          <div
            css={css`
              margin-top: 16px;
              text-align: center;
              .sponsorlist {
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
                align-content: flex-start;
                align-items: flex-start;
                margin: 12px 0;
                gap: 12px 0;
              }
              .sponsorlist .sponsor:hover {
                filter: drop-shadow(1px 3px 3px rgba(243, 183, 174, 0.4));
              }
              .sponsorlist.extra {
                gap: 16px 0;
              }
              .sponsorlist.extra .sponsor {
                width: 375px;
              }
              .sponsorlist.extra .sponsor .sponsor-image {
                width: 340px;
                height: 340px;
              }
              .sponsorlist.extra .sponsor-image img {
                max-width: 300px;
                max-height: 290px;
              }
              .sponsorlist.small .sponsor {
                width: 175px;
              }
              .sponsorlist.small .sponsor .sponsor-image {
                width: 160px;
                height: 160px;
              }
              .sponsorlist.small .sponsor-image img {
                max-width: 120px;
                max-height: 110px;
              }
            `}>
            <div className="sponsorlist">
              <Sponsor
                name="さくらインターネット株式会社"
                role="サポーター"
                image="/static/sponsors/sakura.png"
                href="https://www.sakura.ad.jp/"
              />
              <Sponsor
                name="株式会社しまや出版"
                role="プリンティングサポーター"
                image="/static/sponsors/shimaya.png"
                href="https://www.shimaya.net/"
              />
            </div>
            <div className="sponsorlist small">
              <Sponsor
                name="esa"
                role="ツールサポーター"
                image="/static/sponsors/esa.png"
                href="https://esa.io"
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
              name="K-9"
              imageUrl="/static/printings/k9.gif"
              linkUrl="https://www.k-k9.jp/"
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
              name="ポプルス"
              imageUrl="/static/printings/popls.jpg"
              linkUrl="https://www.popls.co.jp/"
            />
            <Printing
              name="PICO"
              imageUrl="/static/printings/pico.gif"
              linkUrl="http://www.pico-net.com/doujinshi/"
            />
            <Printing
              name="ねこのしっぽ"
              imageUrl="/static/printings/neko.gif"
              linkUrl="https://www.shippo.co.jp/neko/"
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
