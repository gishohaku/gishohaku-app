/** @jsx jsx */
import { jsx, css } from '@emotion/core'

interface ImageBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string
  // TODO
  size: 'square' | 'circlecut'
  width?: number
  onClick?: () => void
}

const ImageBox: React.FC<ImageBoxProps> = props => {
  const { imageUrl, size, width, ...otherProps } = props
  return (
    <span
      css={css`
        width: ${width ? `${width}px` : '100%'};
        display: inline-block;
        align-items: center;
        justify-content: center;
        border: 1px solid #ddd;
        margin-right: 8px;

        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;

        cursor: ${props.onClick ? 'pointer' : 'inherit'};

        &:last-child {
          margin-right: 0;
        }
        &:before {
          display: block;
          content: ' ';
          padding-bottom: ${size === 'square' ? '100%' : '141%'};
          position: relative;
          width: 100%;
          background-color: white;
          z-index: -1;
        }
      `}
      style={{
        backgroundImage: `url(${props.imageUrl})`
      }}
      {...otherProps}
    >
      {/* <img src={props.imageUrl} /> */}
    </span>
  )
}

export default ImageBox
