import React, { useState, useContext } from 'react'
import Link from 'next/link'
import Router from 'next/router'

import UserContext from '../contexts/UserContext'

import firebase from 'firebase/app'
import 'firebase/auth'

import "minireset.css"

import { jsx, css, Global } from '@emotion/core'
import {
  Toolbar,
  Button,
  DarkMode,
  Tabs,
  Tab,
} from 'sancho'

const Layout = props => {
  const [activeTab, setActiveTab] = useState(props.tab ? Number(props.tab) : 0)
  const { user } = useContext(UserContext)

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
            setActiveTab(i)
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

export default Layout
