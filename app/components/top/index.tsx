/** @jsx jsx */
import Hero from "./hero"
import { css, jsx } from '@emotion/core'
import Sections from "./sections"
import { media, colors } from "../../utils/style";
import Link from "next/link";

const Top = () => (
  <>
    <Link href="/gishohaku2" passHref>
      <a css={css`
        background-color: ${colors.accent};
        color: white;
        font-weight: 600;
        font-size: 16px;
        padding: 10px 16px;
        display: flex;
        align-items: center;
        text-decoration: none;
        @media ${media.small} {
          flex-direction: column;
          align-items: start;
        }
        &:hover {
          background-color: #dbae29;
        }

      `}>
        第2回 技術書同人誌博覧会 開催決定
        <span css={css`
          // background-color: white;
          color: #B28246;
          display: inline-block;
          margin-left: auto;
          font-size: 14px;
          padding: 8px 24px;
          border-radius: 40px;
          border: 1px solid white;
          color: white;
          @media ${media.small} {
            margin: 8px 0 0;
          }
        `}>
          詳しくはこちら
        </span>
      </a>
    </Link>
    <Hero />
    <Sections />
  </>
)

export default Top
