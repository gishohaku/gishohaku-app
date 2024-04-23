/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import Link from 'next/link'
import book from '../images/icons/book.svg'
import groupWork from '../images/icons/groupWork.svg'
import home from '../images/icons/home.svg'
import person from '../images/icons/person.svg'
import { useContext } from 'react'
import EventContext from '../contexts/EventContext'

const spacer = css`
  width: 8px;
  display: inline-block;
`

const item = css`
  padding: 10px 0 8px;
  width: 80px;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  user-select: none;
  color: inherit;
  text-decoration: none;
  &:hover,
  &:focus {
    background-color: #f7f8fa;
  }
  &:active {
    background-color: #dbdfe6;
  }
  img {
    user-select: none;
    /* iPhoneでタップしたときのハイライトを削除 */
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
`

const label = css`
  font-size: 11px;
  font-weight: bold;
  opacity: 0.8;
  margin-top: 1px;
`

const icon = css`
  opacity: 0.5;
  display: block;
  margin: 0 auto;
`

const BottomBar = () => {
  const { eventId } = useContext(EventContext)
  return (
    <div
      css={css`
        position: fixed;
        bottom: -4px;
        width: 100%;
        z-index: 10;
        white-space: nowrap;
      `}>
      <div
        css={css`
          border: 1px solid #eee;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          background-color: white;
          display: flex;
          justify-content: center;
          padding-bottom: 4px;
          padding-bottom: calc(constant(safe-area-inset-bottom) + 4px);
          padding-bottom: calc(env(safe-area-inset-bottom) + 4px);
          transition: padding-bottom 0.15s ease-out;
        `}>
        <span css={spacer} />
        <Link href={eventId === 'gishohaku10' ? '/' : `/${eventId}`} passHref>
          <a css={item}>
            <img src={home} width={28} css={icon} />
            <div css={label}>ホーム</div>
          </a>
        </Link>
        <Link href={`/${eventId}/circles`} passHref>
          <a css={item}>
            <img src={groupWork} width={28} css={icon} />
            <div css={label}>サークル</div>
          </a>
        </Link>
        <Link href={`/${eventId}/books`} passHref>
          <a css={item}>
            <img src={book} width={28} css={icon} />
            <div css={label}>頒布物</div>
          </a>
        </Link>
        <Link href={`/${eventId}/mypage`} passHref>
          <a css={item}>
            <img src={person} width={28} css={icon} />
            <div css={label}>マイページ</div>
          </a>
        </Link>
        <span css={spacer} />
      </div>
    </div>
  )
};

export default BottomBar;
