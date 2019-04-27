import React, { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Router from 'next/router'

import { jsx, css, Global } from '@emotion/core'
import {
  Layer,
  Toolbar,
  Text,
  Button,
  Navbar,
  DarkMode,
  Tabs,
  Tab,
  List,
  ListItem,
  IconChevronRight
} from 'sancho'

const Layout = props => {
  const [activeTab, setActiveTab] = useState(props.tab ? Number(props.tab) : 0)

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
          <Link href="/">
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
          value={activeTab}
          onChange={i => {
            setActiveTab(i)
            const page = {
              pathname: '/',
              query: {
                tab: i
              }
            }
            Router.replace(page, page, {
              shallow: true
            })
          }}
        >
          <Tab id="all">All</Tab>
          <Tab id="develop">Develop</Tab>
          <Tab id="design">Design</Tab>
          <Tab id="event">Event</Tab>
        </Tabs>
      </DarkMode>
      <div>{props.children}</div>
    </>
  )
}

export default Layout
