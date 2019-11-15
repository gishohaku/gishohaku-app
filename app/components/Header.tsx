/** @jsx jsx */
import Link from 'next/link'

import logo from '../images/shortLogo.svg'
import { media } from '../utils/style'

import { jsx, css } from '@emotion/core'
import { IconMenu, Sheet, List, ListItem, IconChevronRight, Divider, IconExternalLink, IconHeart, IconLogIn } from 'sancho'
import { useState, useContext, useEffect } from 'react'
import EventContext from '../contexts/EventContext'
import UserContext from '../contexts/UserContext'
// import { ListItem } from '../components/List'

const buttonSize = 48

const noDecoration = css`
  text-decoration: none;
`

const hamburgerButton = css`
  width: ${buttonSize}px;
  height: ${buttonSize}px;
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

export const headerHeight = 66

const useShyHeader = () => {
  const [isHeaderVisible, setVisible] = useState(true)

  useEffect(() => {
    let prevOffset = 0, ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        if (window.pageYOffset <= 100) {
          setVisible(true)
        } else if (prevOffset <= window.pageYOffset) {
          setVisible(false)
          prevOffset = window.pageYOffset;
        } else if (prevOffset > window.pageYOffset + headerHeight) {
          setVisible(true)
          prevOffset = window.pageYOffset;
        }
        ticking = false;
      });
      ticking = true;
    }

    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => document.removeEventListener("scroll", handleScroll)
  }, [])

  return { isHeaderVisible }
}

const Header: React.FC<any> = () => {
  const { eventId } = useContext(EventContext)
  const { user } = useContext(UserContext)
  const [isOpen, setOpen] = useState(false)
  const { isHeaderVisible } = useShyHeader()

  return (
    <header
      css={css`
        background-color: white;
        display: flex;
        align-items: center;
        font-size: 12px;
        padding: 0 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        min-height: ${headerHeight}px;
        user-select: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        transition: transform .15s ease-out;
      `}
      style={{ transform: `translateY(${isHeaderVisible ? '0' : '-66'}px)` }}
    >
      <div css={[hamburgerButton, css`margin-right: auto;`]} onClick={() => setOpen(true)}>
        <IconMenu />
      </div>
      <Link href={`/${eventId == 'gishohaku2' ? '' : eventId}`} passHref>
        <a
          css={css`
          padding: 13px;
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
            css={css`
              display: block;
              pointer-events: none;
            `}
            alt="技術書同人誌博覧会"
          />
        </a>
      </Link>
      <div css={[hamburgerButton, css`margin-left: auto;`]}>
        {user && <Link href="/[eventId]/mypage/circle_stars" as={`/${eventId}/mypage/circle_stars`}>
          <IconHeart />
        </Link>}
      </div>
      <Sheet position="left" onRequestClose={() => setOpen(false)} isOpen={isOpen}>
        <List>
          <Link href="/gishohaku1" passHref>
            <a css={noDecoration}>
              <ListItem
                primary="第1回 技術書同人誌博覧会"
                secondary="2019年7月27日 開催"
                contentAfter={<IconChevronRight />}
                onClick={() => setOpen(false)}
              />
            </a>
          </Link>
          <Link href="/" passHref>
            <a css={noDecoration}>
              <ListItem
                primary="第2回 技術書同人誌博覧会"
                secondary="2019年12月14日 開催予定"
                contentAfter={<IconChevronRight />}
                onClick={() => setOpen(false)}
              />
            </a>
          </Link>
          <Divider />
          <a href="https://blog.gishohaku.dev/" target="_blank" rel="noopener" css={noDecoration}>
            <ListItem
              primary="公式ブログ"
              secondary="コアスタッフによる情報発信ブログ"
              contentAfter={<IconExternalLink />}
            />
          </a>
          <Divider />
        </List>
        <ul css={css`
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
            <a href="/gishohaku1/terms">サークル参加規約</a>
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
        <Divider />
        <div css={css`
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
