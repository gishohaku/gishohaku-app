/** @jsx jsx */
import Link from 'next/link'
import { media, colors } from '../../utils/style'
import SectionHeader from '../../components/SectionHeder'

import { jsx, css } from '@emotion/core'
import {
  List,
  ListItem,
  IconChevronRight,
} from 'sancho'

const noDecoration = css`
  text-decoration: none;
`
const section = css`
  padding: 48px 0;
  background-color: white;
  @media ${media.large} {
    padding: 32px 0;
  }
  :nth-child(odd) {
    background-color: #f7f8fa;
  }
`

export default () => {
  return (
    <>
      <section css={section}>
        <SectionHeader en="ARCHIVE">過去の開催回一覧</SectionHeader>
        <List>
          <Link href="/gishohaku10" passHref>
            <a css={noDecoration}>
              <ListItem
                primary="第十回 技術書同人誌博覧会"
                secondary="2024年5月12日 開催"
                contentAfter={<IconChevronRight />}
              />
            </a>
          </Link>
          <Link href="/" passHref>
            <a css={noDecoration}>
              <ListItem
                primary="第九回 技術書同人誌博覧会"
                secondary="2023年11月25日 開催"
                contentAfter={<IconChevronRight />}
              />
            </a>
          </Link>
          <Link href="/gishohaku8" passHref>
            <a css={noDecoration}>
              <ListItem
                primary="第八回 技術書同人誌博覧会"
                secondary="2023年5月28日 開催"
                contentAfter={<IconChevronRight />}
              />
            </a>
          </Link>
          <Link href="/gishohaku7" passHref>
            <a css={noDecoration}>
              <ListItem
                primary="第七回 技術書同人誌博覧会"
                secondary="2022年11月20日 開催"
                contentAfter={<IconChevronRight />}
              />
            </a>
          </Link>
          <Link href="/gishohaku5" passHref>
            <a css={noDecoration}>
              <ListItem
                primary="第五回 技術書同人誌博覧会"
                secondary="2021年6月19日 開催"
                contentAfter={<IconChevronRight />}
              />
            </a>
          </Link>
          <Link href="/gishohaku2" passHref>
            <a css={noDecoration}>
              <ListItem
                primary="第二回 技術書同人誌博覧会"
                secondary="2019年12月14日 開催"
                contentAfter={<IconChevronRight />}
              />
            </a>
          </Link>
          <Link href="/gishohaku1" passHref>
            <a css={noDecoration}>
              <ListItem
                primary="第一回 技術書同人誌博覧会"
                secondary="2019年7月27日 開催"
                contentAfter={<IconChevronRight />}
              />
            </a>
          </Link>
        </List>
      </section>
    </>
  )
}
