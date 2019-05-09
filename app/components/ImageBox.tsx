/** @jsx jsx */
import { jsx, css } from '@emotion/core'

interface ImageBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string
  // TODO
  size: 'square' | 'circlecut'
  width?: number
}

const ImageBox: React.FC<ImageBoxProps> = (props) => {
  const { imageUrl, size, width, ...otherProps } = props
  return <span css={css`
    min-width: 180px;
    width: ${width || '180'}px;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ddd;
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
    &:after {
      display: inline-block;
      content: " ";
      padding-bottom: ${size === 'square' ? '100%' : '142%'};
      position: relative;
    }
`} {...otherProps}>
    <img src={props.imageUrl} />
  </span>
}

export default ImageBox