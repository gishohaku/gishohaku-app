/** @jsx jsx */
import Link from 'next/link'

import logo from '../images/logo.png'
import { media } from '../utils/style'

import { jsx, css } from '@emotion/core'
import { IconMenu, Sheet, List, ListItem, IconChevronRight } from 'sancho';
import { useState } from 'react';

const buttonSize = 48

const hamburgerButton = css`
  margin-left: auto;
  width: ${buttonSize}px;
  height: ${buttonSize}px;
  background-color: #eee;
  border-radius: ${buttonSize / 2}px;
  position: relative;
  cursor: pointer;

  &:hover {
    background-color: #e5e5e5;
  }

  &:active {
    background-color: #ddd;
  }

  svg {
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
    top: 50%;
    left: 50%;
  }
`

const Header: React.FC<any> = () => {
  const [isOpen, setOpen] = useState(false)
  return <header
    css={css`
      background-color: white;
      display: flex;
      align-items: center;
      font-size: 12px;
      padding: 0 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      min-height: 80px;
      @media ${media.small} {
        padding: 0;
      }
    `}
  >
    <div css={css(hamburgerButton, `
      visibility: hidden;
    `)} />
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
    <div css={hamburgerButton} onClick={() => setOpen(true)}>
      <IconMenu />
    </div>
    <Sheet position="right" onRequestClose={() => setOpen(false)} isOpen={isOpen}>
      <List>
        <Link href="/gishohaku1" passHref>
          <ListItem primary="第1回 技術書同人誌博覧会" secondary="2019年7月27日 開催" contentAfter={<IconChevronRight />} component="a" onClick={() => setOpen(false)} />
        </Link>
        <Link href="/" passHref>
          <ListItem primary="第2回 技術書同人誌博覧会" secondary="2019年12月14日 開催予定" contentAfter={<IconChevronRight />} component="a" onClick={() => setOpen(false)} />
        </Link>
      </List>
    </Sheet>
  </header>
}


export default Header
