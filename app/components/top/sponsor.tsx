/** @jsx jsx */
import { jsx, css } from "@emotion/core"
import { Embed } from 'sancho'
import defaultImage from '../../images/sponsor.png'
import LazyLoad from 'react-lazyload'

interface Props {
  image?: string
  role: string
  name?: string
}

const sponsor : React.FC<Props> = ({image, name, role}) => {
  return <div style={{marginTop: 12}}>
  <Embed width={140} height={140} css={css`
    border: 1px solid #eee;
    background-color: white;
  `}>
    <LazyLoad>
      <img src={image || defaultImage} css={css`
        object-fit: contain;
        display: block;
        padding: 12px;
      `} />
    </LazyLoad>
  </Embed>
  <p css={css`
    font-size: 12px;
    margin-top: 8px;
    line-height: 1;
    opacity: 0.8;
  `}>{role}</p>
  <p css={css`
    font-size: 15px;
    font-weight: bold;
  `}>{name || '募集中'}</p>
  </div>
}

export default sponsor