/** @jsx jsx */
import React, { useState, useContext } from 'react'
import Link from 'next/link'
import Router from 'next/router'

import UserContext from '../contexts/UserContext'

import firebase from 'firebase/app'
import 'firebase/auth'

import "minireset.css"

import logo from "../images/logo.png"
import { colors, media } from "../utils/style"

import { jsx, css, Global } from '@emotion/core'
import {
  Toolbar,
  Button,
  DarkMode,
  Tabs,
  Tab,
} from 'sancho'

const Layout = props => {
  const { user } = useContext(UserContext)

  return <>
    <Global styles={css`
      @import url(https://fonts.googleapis.com/css?family=Noto+Sans+JP:400,700&font-display=swap);
      body {
        /* TODO: 諸々指定 */
        font-family: "Noto Sans JP";
        -webkit-font-smoothing: antialiased;
        font-feature-settings : "palt";
      }
    `} />
    {!props.hideHeader &&
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
            align-items: start;
            padding: 0;
          }
        `}
      >
        <Link href="/" passHref>
          <a>
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
    }
    <Link href='/mypage' passHref>
      <a css={css`
        margin-left: auto;
        border: 1px solid #2A5773;
        text-decoration: none;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 600;
        color: #2A5773;
        transition: all .2s ease;
        white-space: nowrap;
        &:hover {
          background-color: #2A5773;
          color: white;
        }
        position: absolute;
        right: 16px;
        top: 22px;
      `}>
        マイページ
      </a>
    </Link>
    <div css={css`
      min-height: calc(100vh - 80px - 88px);
      position: relative;
    `}>
      {props.children}
    </div>
    <Footer />
  </>;

  return (
    <>
      <Global
        styles={{
          body: {
            padding: 0,
            margin: 0
          }
        }}
      />
      <Toolbar
        style={{
          backgroundColor: 'rgb(52, 58, 64)',
          justifyContent: 'center'
        }}
      >
        <DarkMode>
          <Link href="/books">
            <Button variant="ghost">Demo Blog with WP REST API</Button>
          </Link>
        </DarkMode>
      </Toolbar>
      <DarkMode>
        <Tabs
          css={css`
            background-color: rgb(52, 58, 64);
          `}
          variant="evenly-spaced"
          // value={activeTab}
          value={-1}
          onChange={i => {
            const pathes = ['/', '/books', '/mypage']
            Router.push(pathes[i])
          }}
        >
          <Tab id="all">All</Tab>
          <Tab id="develop">Books</Tab>
          <Tab id="mypage">Mypage</Tab>
        </Tabs>
      </DarkMode>
      {user ? <div onClick={() => {
        firebase.auth().signOut()
          .catch(function (error) {
            console.log('ログアウトに失敗しました。')
          });
      }}>
        {user.displayName} Logout
        </div> : <div onClick={() => {
          const provider = new firebase.auth.GoogleAuthProvider()
          firebase.auth().signInWithPopup(provider).then(function (result) {
            console.log(result)
          })
        }}>
          Login
        </div>
      }
      <div>{props.children}</div>
    </>
  )
}


const Footer = () => (
  <footer
    css={css`
      background-color: ${colors.gray100};
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      padding: 8px;
    `}
  >
    <ul
      css={css`
        li {
          display: inline-block;
          margin: 6px 0px;
          padding: 6px;
        }
      `}
    >
      <li>
        <a href="https://portal.engineers-lt.info/">運営</a>
      </li>
      <li>
        <a href="https://portal.engineers-lt.info/guideline">
          コミュニティ・ガイドライン
        </a>
      </li>
      <li>
        <a href="mailto:gishohaku@engineers-lt.info">お問い合わせ</a>
      </li>
    </ul>
    <p
      css={css`
        margin: 6px 0;
        opacity: 0.8;
      `}
    >
      © エンジニアの登壇を応援する会
    </p>
  </footer>
)

export default Layout
