/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Embed } from 'sancho'
import defaultImage from '../../images/sponsor.png'
import LazyLoad from 'react-lazyload'
import { media } from '../../utils/style'

interface Props {
  image?: string
  role: string
  name: string
  href: string
  block?: boolean
}

const sponsor: React.FC<Props> = ({
  image,
  name,
  role,
  href,
  block = false,
}) => {
  return (
    <div
      css={css`
        width: ${block ? '100%' : '210px'};
        text-align: center;
        margin: 12px 0;
        @media ${media.small} {
          width: 150px;
          margin-right: 10px;
          margin-left: 10px;
        }
      `}>
      <Embed
        width={150}
        height={150}
        css={css`
          border: 1px solid #eee;
          background-color: white;
          width: 160px;
          margin: 0 auto;
        `}>
        <LazyLoad offset={400}>
          <a
            href={href || 'javascript:void(0);'}
            css={css`
              align-items: center;
              display: flex;
              padding: 12px;
              text-align: center;
            `}
            target="_blank"
            rel="noopener">
            <img
              css={css`
                max-height: 100%;
                margin: 0 auto;
              `}
              src={image || defaultImage}
            />
          </a>
        </LazyLoad>
      </Embed>
      <p
        css={css`
          font-size: 12px;
          margin-top: 6px;
          line-height: 1.4;
          opacity: 0.8;
        `}>
        {role}
      </p>
      <p
        css={css`
          font-size: 15px;
          font-weight: bold;
          line-height: 1.5;
        `}>
        <a
          css={css`
            text-decoration: none;
            color: #1d272d;
          `}
          href={href}
          target="_blank"
          rel="noopener">
          {name || '募集中'}
        </a>
      </p>
    </div>
  )
}

export default sponsor
