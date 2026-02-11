/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import Book from '../utils/book'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export enum SnsShareSize {
  Small,
  Large,
}

interface Props {
  size: SnsShareSize
}

const SnsShare: React.FC<Props> = (props) => {
  useEffect(() => {
    const scriptNode = document.getElementById('twitter-wjs')
    if (scriptNode) {
      scriptNode.parentNode!.removeChild(scriptNode)
    }
    const parent_js = document.getElementsByTagName('script')[0]

    const facebook_js = document.createElement('script')
    facebook_js.id = 'facebook-js'
    facebook_js.src = '//connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v18.0'
    parent_js.parentNode!.insertBefore(facebook_js, parent_js)

    const twitter_js = document.createElement('script')
    twitter_js.id = 'twitter-wjs'
    twitter_js.src = '//platform.twitter.com/widgets.js'
    parent_js.parentNode!.insertBefore(twitter_js, parent_js)

    const hatena_js = document.createElement('script')
    hatena_js.id = 'hatena-js'
    hatena_js.src = '//b.st-hatena.com/js/bookmark_button.js'
    parent_js.parentNode!.insertBefore(hatena_js, parent_js)
  }, [props])

  const { asPath } = useRouter()
  const currentUrl = 'https://gishohaku.dev' + asPath

  return (
    <div
      css={css`
        .twitter-share-button,
        .fb-share-button,
        .hatena-bookmark-button-frame {
          vertical-align: top;
          margin-right: 4px;
          display: inline-block;
        }
        .fb-share-button > span {
          vertical-align: top !important;
        }
      `}>
      <div id="fb-root"></div>
      <a
        href="https://twitter.com/share?ref_src=twsrc%5Etfw"
        className="twitter-share-button"
        data-size={props.size == SnsShareSize.Small ? 'small' : 'large'}
        data-hashtags="技書博"
        data-via="gishohaku"
        data-related="gishohaku"
        data-show-count="false">
        Twitterで共有
      </a>

      <div
        className="fb-share-button"
        data-href={currentUrl}
        data-layout="button"
        data-size={props.size == SnsShareSize.Small ? 'small' : 'large'}>
        <a
          target="_blank"
          href={
            'https://www.facebook.com/sharer/sharer.php?u=' +
            encodeURIComponent(currentUrl) +
            '&amp;src=sdkpreparse'
          }
          className="fb-xfbml-parse-ignore">
          Facebookで共有
        </a>
      </div>
      <a
        href="http://b.hatena.ne.jp/entry/"
        className="hatena-bookmark-button"
        data-hatena-bookmark-layout="basic-label"
        data-hatena-bookmark-lang="ja"
        data-hatena-bookmark-height={
          props.size == SnsShareSize.Small ? '20' : '28'
        }
        data-hatena-bookmark-width={
          props.size == SnsShareSize.Small ? '95' : '100'
        }
        title="このエントリーをはてなブックマークに追加">
        <img
          src="//b.st-hatena.com/images/entry-button/button-only@2x.png"
          alt="このエントリーをはてなブックマークに追加"
          width="20"
          height="20"
          style={{ border: 'none' }}
        />
      </a>
    </div>
  )
}

export default SnsShare
