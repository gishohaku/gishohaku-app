/** @jsx jsx */
import React, { useState, useContext } from 'react'
import Link from 'next/link'

import UserContext from '../contexts/UserContext'

import firebase from 'firebase/app'
import 'firebase/auth'

import logo from '../images/logo.png'
import { colors, media } from '../utils/style'
import {
  useToast,
  IconButton,
  IconMenu,
  Sheet,
  MenuList,
  MenuItem,
  MenuDivider,
  IconUser,
  IconLogIn,
  IconLogOut
} from 'sancho'

import { jsx, css, Global } from '@emotion/core'
import BottomBar from './BottomBar'

const Layout = props => {
  const toast = useToast()
  const { user } = useContext(UserContext)
  const [isOpen, setOpen] = useState(false)

  return (
    <>
      <Global
        styles={css`
          @import url(https://fonts.googleapis.com/css?family=Noto+Sans+JP:400, 700&display=swap);
          body {
            /* TODO: 諸々指定 */
            font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, Roboto, '游ゴシック体',
              YuGothic, 'Yu Gothic Medium', sans-serif;
            -webkit-font-smoothing: antialiased;
            font-feature-settings: 'palt';
            font-size: 15px;
            color: #444;
            background-color: #f7f8fa;
          }
          p,
          li {
            line-height: 1.8;
          }
        `}
      />
      {!props.hideHeader && (
        <header
          css={css`
            background-color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12px;
            padding: 0 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            min-height: 80px;
            @media ${media.small} {
              padding: 0;
            }
          `}
        >
          <Link href="/" passHref>
            <a
              css={css`
                &:hover {
                  background-color: #eff0f0;
                }
                &:active {
                  background-color: #dededf;
                }
              `}
            >
              <img
                src={logo}
                width={80}
                height={80}
                css={css`
                  display: block;
                `}
                alt="技術書同人誌博覧会"
              />
            </a>
          </Link>
        </header>
      )}
      <div
        css={css`
          min-height: calc(100vh - 80px - 88px);
          position: relative;
        `}
      >
        {props.children}
      </div>
      <BottomBar />
      <Footer />
    </>
  )
}

const Footer = () => (
  <footer
    css={css`
      background-color: ${colors.gray100};
      font-size: 12px;
      padding: 8px 12px ${72 + 16}px;
      text-align: center;
    `}
  >
    <ul
      css={css`
        li {
          display: inline-block;
          margin-top: 6px;
          @media ${media.small} {
            display: block;
            text-align: left;
            margin-top: 0;
          }
          > a {
            display: block;
            padding: 6px;
          }
        }
      `}
    >
      <li>
        <a href="/terms">サークル参加規約</a>
      </li>
      <li>
        <a href="https://portal.engineers-lt.info/">運営</a>
      </li>
      <li>
        <a href="https://portal.engineers-lt.info/guideline">コミュニティ・ガイドライン</a>
      </li>
      <li>
        <a href="mailto:info@gishohaku.dev">お問い合わせ</a>
      </li>
    </ul>
    <p
      css={css`
        margin: 6px 0;
        opacity: 0.8;
      `}
    >
      © 技術書同人誌博覧会 運営事務局
    </p>
  </footer>
)

export default Layout
