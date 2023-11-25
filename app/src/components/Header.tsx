/** @jsx jsx */
import Link from 'next/link'

import logo from '../images/shortLogo.svg'

import { jsx, css } from '@emotion/core'
import {
  IconMenu,
  Sheet,
  List,
  ListItem,
  IconChevronRight,
  IconExternalLink,
  IconHeart,
} from 'sancho'
import { useState, useContext, useEffect } from 'react'
import EventContext from '../contexts/EventContext'
import UserContext from '../contexts/UserContext'
import { useRouter } from 'next/router'

const buttonSize = 48

const noDecoration = css`
  text-decoration: none;
`

const divider = css`
  margin: 16px 0;
  border-top: 1px solid #ddd;
`

const hamburgerButton = css`
  width: ${buttonSize}px;
  height: ${buttonSize}px;
  border-radius: ${buttonSize / 2}px;
  position: relative;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.12);
  }

  svg {
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
    top: 50%;
    left: 50%;
  }
`

export const headerHeight = 66

const useShyHeader = () => {
  const [isHeaderVisible, setVisible] = useState(true)

  useEffect(() => {
    let prevOffset = 0,
      ticking = false

    const handleScroll = () => {
      if (ticking) return
      window.requestAnimationFrame(() => {
        if (window.pageYOffset <= 100) {
          setVisible(true)
        } else if (prevOffset <= window.pageYOffset) {
          setVisible(false)
          prevOffset = window.pageYOffset
        } else if (prevOffset > window.pageYOffset + headerHeight) {
          setVisible(true)
          prevOffset = window.pageYOffset
        }
        ticking = false
      })
      ticking = true
    }

    document.addEventListener('scroll', handleScroll, { passive: true })
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  return { isHeaderVisible }
}

const Header: React.FC<any> = () => {
  const { eventId } = useContext(EventContext)
  const { user } = useContext(UserContext)
  const [isOpen, setOpen] = useState(false)
  const { isHeaderVisible } = useShyHeader()
  const router = useRouter()

  const isTransparent = router.asPath === '/gishohaku2' // TODO

  return (
    <header
      css={css`
        background-color: ${isTransparent ? 'transparent' : 'white'};
        display: flex;
        align-items: center;
        font-size: 12px;
        padding: 0 12px;
        box-shadow: 0 2px 8px
          ${isTransparent ? 'transparent' : 'rgba(0, 0, 0, 0.08)'};
        min-height: ${headerHeight}px;
        user-select: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        transition: transform 0.15s ease-out;
      `}
      style={{ transform: `translateY(${isHeaderVisible ? '0' : '-66'}px)` }}>
      <div
        className="mr-auto"
        css={hamburgerButton}
        onClick={() => setOpen(true)}>
        <IconMenu />
      </div>
      <Link
        href={`/${
          ['gishohaku1', 'gishohaku2', 'gishohaku3', 'gishohaku4'].includes(
            eventId,
          )
            ? eventId
            : ''
        }`}
        passHref>
        <a
          css={css`
            padding: 13px;
            &:hover {
              background-color: rgba(0, 0, 0, 0.08);
            }

            &:active {
              background-color: rgba(0, 0, 0, 0.12);
            }
          `}>
          <img
            src={logo}
            width={80}
            css={css`
              display: block;
              pointer-events: none;
            `}
            alt="技術書同人誌博覧会"
          />
        </a>
      </Link>
      <div className="ml-auto" css={hamburgerButton}>
        {user && (
          <Link href={`/${eventId}/mypage/circle_stars`} passHref>
            <a className='block h-full'>
              <IconHeart />
            </a>
          </Link>
        )}
      </div>
      <Sheet
        position="left"
        onRequestClose={() => setOpen(false)}
        isOpen={isOpen}>
        <List>
          <Link href="/" passHref>
            <a css={noDecoration}>
              <ListItem
                primary="第十回 技術書同人誌博覧会"
                secondary="2024年5月12日 開催"
                contentAfter={<IconChevronRight />}
                onClick={() => setOpen(false)}
              />
            </a>
          </Link>
          <Link href="/gishohaku9" passHref>
            <a css={noDecoration}>
              <ListItem
                primary="第九回 技術書同人誌博覧会"
                secondary="2023年11月25日 開催"
                contentAfter={<IconChevronRight />}
                onClick={() => setOpen(false)}
              />
            </a>
          </Link>
          <div css={divider} />
          <Link href="/archive" passHref>
            <a css={noDecoration}>
              <ListItem
                primary="過去の開催回一覧"
                contentAfter={<IconChevronRight />}
              />
            </a>
          </Link>
          <div css={divider} />
          <a
            href="https://blog.gishohaku.dev/"
            target="_blank"
            rel="noopener"
            css={noDecoration}>
            <ListItem
              primary="公式ブログ"
              secondary="コアスタッフによる情報発信ブログ"
              contentAfter={<IconExternalLink />}
            />
          </a>
          <a
            href="https://gishohaku.connpass.com/"
            target="_blank"
            rel="noopener"
            css={noDecoration}>
            <ListItem
              primary="Connpass"
              secondary="技書博関連イベントページ"
              contentAfter={<IconExternalLink />}
            />
          </a>
          <div css={divider} />
        </List>
        <ul
          css={css`
            li a {
              display: block;
              text-decoration: none;
              padding: 0.2rem 1.5rem;
              color: inherit;
              &:hover {
                background-color: #f1f3f5;
              }
            }
          `}>
          <li>
            <a
              target="_blank"
              rel="noopener"
              href="https://esa-pages.io/p/sharing/13039/posts/13/4c6fe5c0f58bb4fb32cd.html">
              行動規範
            </a>
          </li>
          <li>
            <a href="mailto:info@gishohaku.dev">お問い合わせ</a>
          </li>
        </ul>
        <div css={divider} />
        <div
          css={css`
            padding: 0 1.5rem;
            opacity: 0.6;
            font-size: 12px;
          `}>
          © 技術書同人誌博覧会 運営事務局
        </div>
      </Sheet>
    </header>
  )
}

export default Header
