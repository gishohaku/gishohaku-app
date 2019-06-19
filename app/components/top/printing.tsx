/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Embed } from 'sancho'
import LazyLoad from 'react-lazyload'
import { colors } from '../../utils/style'

interface Props {
  image?: string
  name: string
  url: string
}

const printing: React.FC<Props> = ({ image, name, url }) => {
  return (
    <a href={url} target="_blank" rel="noopner">
      <Embed
        width={200}
        height={40}
        css={css`
          border: 1px solid #eee;
          background-color: white;
          display: inline-block;
          width: 200px;
          height: 40px;
          margin: 16px 16px;
          text-align: center;
          vertical-align: middle;
          p {
            line-height: 40px;
            font-weight: 600;
            color: inherit;
          }
          &:hover {
            border-color: ${colors.primary};
          }
        `}
      >
        {image ? (
          <LazyLoad offset={400}>
            <img
              src={image}
              css={css`
                object-fit: contain;
                display: block;
              `}
            />
          </LazyLoad>
        ) : (
          <p>{name}</p>
        )}
      </Embed>
    </a>
  )
}

export default printing
