/** @jsx jsx */
import Link from 'next/link'

import { jsx, css } from '@emotion/core'
import {
  List,
  ListItem,
  IconChevronRight,
} from 'sancho'

const noDecoration = css`
  text-decoration: none;
`

export default () => {
  return (
    <>
      <List>
        <Link href="/gishohaku10" passHref>
          <a css={noDecoration}>
            <ListItem
              primary="技書博10"
              secondary="2024.5.12"
              contentAfter={<IconChevronRight />}
            />
          </a>
        </Link>
        <Link href="/gishohaku9" passHref>
          <a css={noDecoration}>
            <ListItem
              primary="技書博9"
              secondary="2023.11.25"
              contentAfter={<IconChevronRight />}
            />
          </a>
        </Link>
        <Link href="/gishohaku8" passHref>
          <a css={noDecoration}>
            <ListItem
              primary="技書博8"
              secondary="2023.5.28"
              contentAfter={<IconChevronRight />}
            />
          </a>
        </Link>
        <Link href="/gishohaku7" passHref>
          <a css={noDecoration}>
            <ListItem
              primary="技書博7"
              secondary="2022.11.20"
              contentAfter={<IconChevronRight />}
            />
          </a>
        </Link>
        <Link href="/gishohaku5" passHref>
          <a css={noDecoration}>
            <ListItem
              primary="技書博5"
              secondary="2021.6.19"
              contentAfter={<IconChevronRight />}
            />
          </a>
        </Link>
        <Link href="/gishohaku2" passHref>
          <a css={noDecoration}>
            <ListItem
              primary="技書博2"
              secondary="2019.12.14"
              contentAfter={<IconChevronRight />}
            />
          </a>
        </Link>
        <Link href="/gishohaku1" passHref>
          <a css={noDecoration}>
            <ListItem
              primary="技書博1"
              secondary="2019.7.27"
              contentAfter={<IconChevronRight />}
            />
          </a>
        </Link>
      </List>
    </>
  )
}
