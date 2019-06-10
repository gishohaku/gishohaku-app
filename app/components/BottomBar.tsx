/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import Link from 'next/link'
import { media, colors } from '../utils/style'
import book from '../images/icons/book.svg'
import groupWork from '../images/icons/groupWork.svg'
import home from '../images/icons/home.svg'
import person from '../images/icons/person.svg'

interface Props {
  name: string
  icon: any
}

const spacer = css`
  width: 8px;
  display: inline-block;
`

const item = css`
  padding: 10px 0;
  width: 80px;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  user-select: none;
  color: inherit;
  text-decoration: none;
  &:hover {
    background-color: #f7f8fa;
  }
  &:active,
  &:focus {
    background-color: #dbdfe6;
  }
`

const label = css`
  font-size: 12px;
  font-weight: bold;
  opacity: 0.8;
  margin-top: 2px;
`

const icon = css`
  opacity: 0.5;
  display: block;
  margin: 0 auto;
`

export default () => {
  return (
    <div
      css={css`
        position: fixed;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        white-space: nowrap;
      `}
    >
      <div
        css={css`
          border: 1px solid #eee;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          background-color: white;
          border-radius: 8px;
        `}
      >
        <div css={spacer} />
        <Link href="/" passHref>
          <a css={item}>
            <img src={home} width={30} css={icon} />
            <div css={label}>ホーム</div>
          </a>
        </Link>
        <Link href="/circles" passHref>
          <a css={item}>
            <img src={groupWork} width={30} css={icon} />
            <div css={label}>サークル</div>
          </a>
        </Link>
        <Link href="/books" passHref>
          <a css={item}>
            <img src={book} width={30} css={icon} />
            <div css={label}>頒布物</div>
          </a>
        </Link>
        <Link href="/mypage" passHref>
          <a css={item}>
            <img src={person} width={30} css={icon} />
            <div css={label}>マイページ</div>
          </a>
        </Link>
        <div css={spacer} />
      </div>
    </div>
  )
}
