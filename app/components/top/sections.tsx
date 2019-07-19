/** @jsx jsx */
import { jsx, css } from '@emotion/core'

import placeIcon from './round-place.svg'
import directionsIcon from './round-directions_run.svg'

import { media, colors } from '../../utils/style'
import SectionHeader from '../atoms/SectionHeader'
import TextBlock from '../atoms/TextBlock'

import Sponsor from './sponsor'
import Printing from './printing'
import Banner from './banner'

import { Container } from 'sancho'

const section = css`
  padding: 32px 0 48px;
  background-color: white;
`

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

// NOTE: 本来はこちらでリサイズした画像を用意して、そこから配信するとよい
const members = [
  {
    name: 'ariaki',
    twitter: 'ariaki4dev',
    imageUrl: 'https://portal.engineers-lt.info/elt_logo_w.png'
  },
  {
    name: '水殿',
    twitter: 'midono_ap1',
    imageUrl: 'https://pbs.twimg.com/profile_images/1071222075501629442/bAQUfeke_400x400.jpg'
  },
  {
    name: 'おやかた',
    twitter: 'oyakata2438',
    imageUrl: 'https://pbs.twimg.com/profile_images/893588120666480640/i-kZmS-f_400x400.jpg'
  },
  {
    name: 'kurakake',
    twitter: 'kurakake',
    imageUrl: 'https://i.gyazo.com/0ef049e049c0b0587db07c79c0c373ff.jpg'
  },
  {
    name: 'かめねこ',
    twitter: 'kameneko1004',
    imageUrl: 'https://storage.googleapis.com/jump/kameneko_icon.jpg'
  },
  {
    name: 'kazto',
    twitter: 'bainarian',
    imageUrl: 'https://pbs.twimg.com/profile_images/998919655359107072/WZplgK9h_400x400.jpg'
  },
  {
    name: 'なつお',
    twitter: 'KazuyaNakahara',
    imageUrl: 'https://pbs.twimg.com/profile_images/1086995556600209410/7yUdS_qB_400x400.jpg'
  },
  {
    name: 'mottox2',
    twitter: 'mottox2',
    imageUrl: 'https://avatars1.githubusercontent.com/u/7007253?s=460&v=4'
  },
  {
    name: 'Alice_You',
    twitter: 'Alice_You',
    imageUrl: 'https://pbs.twimg.com/profile_images/192706028/withmona_400x400.jpg'
  },
  {
    name: 'なのなの',
    twitter: 'nano2_aloerina',
    imageUrl: 'https://pbs.twimg.com/profile_images/926635106860535808/lQbUVyz1.jpg'
  },
  {
    name: 'akazunoma',
    twitter: 'akazunoma',
    imageUrl: 'https://pbs.twimg.com/profile_images/1076979292460859395/RKmEjFKW_400x400.jpg'
  },
  {
    name: 'ざき',
    twitter: 'zucky_zakizaki',
    imageUrl: 'https://pbs.twimg.com/profile_images/1077006051533189120/nm5Zz0Qy_400x400.jpg'
  }
]

const Sections = () => (
  <>
    <section css={section}>
      <SectionHeader text="ABOUT">技書博とは</SectionHeader>
      <TextBlock>
        <p>
          技術書同人誌博覧会（技書博）は、エンジニア（おもにITエンジニア）が自身の知見を「本」という形で共有するために開催される、技術書オンリーイベント（同人誌頒布即売会）です。
          私たちエンジニアは、日々の業務や学習によって得た膨大な知識を記憶し、活かしています。
          その知識の大半は「暗黙知」として個人の中に留まり続け、他者に共有できていない有用な情報がたくさんあるのではないでしょうか。
          私たちは、知識を「集合知」としてコミュニティに還元しあうことによって、何倍もの知識を吸収でき、よりよい世界を作り出せると考えています。
        </p>
        <p>
          ここで共有されるべき知識は、至高の情報を持った著名な方からのみでなく、すべてのエンジニアの内に秘めているすべてが対象です。
          あなたの知識は必ず誰かが必要としていて、アウトプットすることで必ず誰かの役に立つことができるはずです。
          これまで技術書を執筆されている方のみでなく、技書博を「初めての本を書くきっかけ」にしてみませんか？
          たとえば、体験談や考察、開発効率をあげるテクニック、生存戦略や成長戦略の描き方など、あなたにしか書けないことはたくさんあるはずです。
        </p>
        <p>
          そして、読者（一般参加者）からのアウトプットも、とても重要です。
          「感想を著者に届けること」自身のTwitterやブログによって著者へフィードバックすることで、モチベーションに繋がり、次の執筆につなげることができます。
          「サービスやプロダクト開発などに役立てること」知識を別の形に変え、アウトプットを繋げていくことで、エンジニアコミュニテイはより活性化します。
          誰もがオープンでカジュアルに知識を共有できる場所を提供することが私たちの目的です。
        </p>
        <dl
          css={css`
            margin-top: 24px;
            dt,
            dd {
              display: inline-block;
              zoom: 1;
              vertical-align: top;
              width: 50%;
              padding: 12px 0;
              margin: 0;
              border-top: 1px solid #eee;
            }

            dt {
              width: 112px;
              color: #666660;
              text-align: right;
              padding-right: 24px;
            }

            dd {
              width: calc(100% - 112px);
            }
          `}
        >
          <dt>日時</dt>
          <dd>
            2019.07.27(Sat.) 11:00-17:00
            <br />※ サークル入場 10:00
          </dd>
          <dt>場所</dt>
          <dd>大田区産業プラザPiO</dd>
          <dt>Twitter</dt>
          <dd>
            公式アカウント:{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/gishohaku">
              @gishohaku
            </a>
            <br />
            ハッシュタグ:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://twitter.com/hashtag/%E6%8A%80%E6%9B%B8%E5%8D%9A"
            >
              #技書博
            </a>
          </dd>
        </dl>
      </TextBlock>
    </section>
    <section
      css={css(
        section,
        `
        background-color: #f7f8fa;
      `
      )}
    >
      <SectionHeader text="ACCESS">アクセス</SectionHeader>
      {/* <div
        css={css`
          height: 450px;
          margin-top: 32px;
        `}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3245.795037859675!2d139.72196261596417!3d35.55876384428474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601860f87f5da4e3%3A0x8a0493a2f4accfb0!2z5aSn55Sw5Yy655Sj5qWt44OX44Op44K2UGlP!5e0!3m2!1sja!2sjp!4v1552499465825"
          frameBorder="0"
          title="会場の地図"
          css={css`
            border: 0;
            height: 100%;
            width: 100%;
          `}
          allowFullScreen
        />
      </div> */}
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
          大田区産業プラザPiO
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
            東京都大田区南蒲田1丁目20-20（
            <a href="https://www.google.com/maps?ll=35.55876,139.724151&z=16&t=m&hl=ja-JP&gl=JP&mapclient=embed&cid=9945236205239848880">
              Google マップ
            </a>
            ）
          </p>
          <p css={withIcon}>
            <img src={directionsIcon} alt="アクセス" />
            京浜急行「京急蒲田」駅より徒歩約3分
            <br />
            JR京浜東北線、東急池上・多摩川線「蒲田」駅より徒歩約13分
          </p>
        </div>
      </TextBlock>
    </section>
    <section
      css={css(
        section,
        `
        background-color: fff;
      `
      )}
    >
      <SectionHeader text="TEAM">チーム</SectionHeader>

      <Container
        css={css`
          max-width: 740px;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          `}
        >
          {members.map(profile => {
            return (
              <a
                href={`https://twitter.com/${profile.twitter}`}
                key={profile.name}
                target="_blank"
                rel="noopener"
                css={css`
                  margin: 24px 12px 12px;
                  color: inherit;
                  text-decoration: none;
                `}
              >
                <img
                  src={profile.imageUrl}
                  css={css`
                    border-radius: 60px;
                    border: 1px solid #eee;
                    width: 100px;
                    height: 100px;
                    object-fit: contain;
                    @media ${media.small} {
                      width: 80px;
                      height: 80px;
                    }
                  `}
                  height={100}
                  width={100}
                />
                <p
                  css={css`
                    text-align: center;
                    font-size: 15px;
                    font-weight: bold;
                  `}
                >
                  {profile.name}
                </p>
              </a>
            )
          })}
        </div>
      </Container>
    </section>
    <section
      css={css(
        section,
        `
        background-color: #f7f8fa;
      `
      )}
    >
      <SectionHeader text="SPONSOR">スポンサー</SectionHeader>
      <Container
        css={css`
          max-width: 740px;
        `}
      >
        <div
          css={css`
            margin-top: 36px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          `}
        >
          <Sponsor
            name="株式会社grasys"
            role="トートバッグサポーター・運営サポーター"
            href="https://www.grasys.io/"
            image="/static/sponsors/grasys.gif"
            block
          />
          <Sponsor
            name="ギリア株式会社"
            role="セキュリティサポーター"
            image="/static/sponsors/ghelia.png"
            href="https://ghelia.com/"
          />
          <Sponsor
            name="株式会社メディアドゥ"
            role="パブリシティサポーター"
            image="/static/sponsors/mediado.png"
            href="https://mediado.jp/"
          />
          <Sponsor
            name="さくらインターネット株式会社"
            role="オフィシャルサポーター"
            href="https://www.sakura.ad.jp/"
            image="/static/sponsors/sakura.png"
          />
          <Sponsor
            name="株式会社grooves"
            role="オフィシャルサポーター"
            href="https://portfolio.forkwell.com/"
            image="/static/sponsors/forkwell.png"
          />
          <Sponsor
            name="テクノブレーン株式会社"
            role="オフィシャルサポーター"
            href="https://www.techno-brain.co.jp/"
            image="/static/sponsors/tbc.gif"
          />
          <Sponsor
            name="株式会社虎の穴"
            role="オフィシャルサポーター"
            href="https://yumenosora.co.jp/tora-lab"
            image="/static/sponsors/tora.png"
          />
          <Sponsor
            name="株式会社インプレスR&D"
            role="懇親会サポーター"
            href="https://nextpublishing.jp/"
            image="/static/sponsors/impress.png"
          />
          <Sponsor
            name="株式会社メディアドゥ"
            role="デザイン協力"
            image="/static/sponsors/mediado.png"
            href="https://mediado.jp/"
          />
          <div
            css={css`
              width: 100%;
            `}
          />
          <Sponsor
            name="CodeZine"
            role="メディアサポーター"
            image="/static/sponsors/codezine.png"
            href="https://codezine.jp/"
          />
          <Sponsor
            name="ThinkIT"
            role="メディアサポーター"
            image="/static/sponsors/thinkit.png"
            href="https://thinkit.co.jp/"
          />
          <Sponsor
            name="日経ソフトウエア"
            role="メディアサポーター"
            image="/static/sponsors/nikkei.png"
            href="https://nkbp.jp/nsoft"
          />
        </div>
      </Container>
    </section>
    <section css={section}>
      <SectionHeader text="PRINTING">バックアップ印刷所</SectionHeader>
      <Container
        css={css`
          max-width: 760px;
          margin-top: 36px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        `}
      >
        <Printing
          name="ねこのしっぽ"
          url="https://www.shippo.co.jp/"
          image="https://www.shippo.co.jp/neko/img/neko_banner.gif"
        />
        <Printing
          name="日光企画"
          url="http://www.nikko-pc.com"
          image="http://www.nikko-pc.com/start/logo.gif"
        />
        <Printing
          name="ポプルス"
          url="http://www.inv.co.jp/~popls"
          image="http://www.inv.co.jp/~popls/sozai/poplsbn2.gif"
        />
        <Printing
          name="ケーナイン"
          url="https://www.k-k9.jp/"
          image="https://www.k-k9.jp/wp-content/themes/k9_20160801/img/logo.gif"
        />
        <Printing name="栄光" url="https://www.eikou.com/" />
        <Printing
          name="しまや出版"
          url="https://www.shimaya.net/"
          image="/static/printings/shimaya.png"
        />
      </Container>
    </section>
    <section
      css={css(
        section,
        `
        background-color: #f7f8fa;
      `
      )}
    >
      <SectionHeader text="HOTEL">宿泊のご案内</SectionHeader>
      <Container
        css={css`
          max-width: 740px;
          margin-top: 36px;
        `}
      >
        <p>
          技書博では、遠方から参加される方のために、会場至近のホテルを割安の価格で利用できる「公式応援ホテル」として提携しました。
          技書博参加者限定で、通常プランと比べ格安に宿泊できるプランを準備していますので、ぜひご検討下さい。
        </p>
        <p>
          <a
            css={css`
              background-color: ${colors.accent};
              font-size: 14px;
              font-weight: bold;
              color: white;
              padding: 6px 24px;
              display: inline-block;
              border-radius: 30px;
              text-decoration: none;
              &:hover {
                transform: translateY(-1px);
                background-color: #dbae29;
              }
            `}
            href="/hotel"
          >
            <span
              className="material-icons"
              css={css`
                vertical-align: middle;
                margin-right: 4px;
                font-size: 20px;
              `}
            >
              hotel
            </span>
            <span
              css={css`
                vertical-align: middle;
              `}
            >
              宿泊の詳細はこちら
            </span>
          </a>
        </p>
      </Container>
    </section>
    <section css={section}>
      <SectionHeader text="BANNER">リンク用バナー</SectionHeader>
      <Container
        css={css`
          max-width: 740px;
          margin-top: 36px;
        `}
      >
        <Banner name="バナー1" image="/static/banner_1.png" />
        <Banner name="バナー2" image="/static/banner_2.png" />
      </Container>
    </section>
    <section
      css={css(
        section,
        `
        background-color: #f7f8fa;
      `
      )}
    >
      <SectionHeader text="RELEASE">リリース</SectionHeader>
      <Container
        css={css`
          max-width: 740px;
          margin-top: 36px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        `}
      >
        <iframe
          src="https://www.value-press.com/pressrelease/latest_lists/61565"
          frameBorder="0"
          title="リリース"
          css={css`
            border: 0;
            height: 100%;
            width: 100%;
          `}
        />
      </Container>
    </section>
  </>
)

export default Sections
