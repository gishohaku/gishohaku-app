/** @jsx jsx */
import { jsx, css } from '@emotion/react'

const Loader: React.FC = (props: any) => {
  return (
    <div
      css={css`
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      `}>
      <div
        css={css`
          position: relative;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #9880ff;
          color: #9880ff;
          -webkit-animation: dot-flashing 1s infinite linear alternate;
          animation: dot-flashing 1s infinite linear alternate;
          -webkit-animation-delay: 00.5s;
          animation-delay: 00.5s;
          &:before,
          &:after {
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background-color: #9880ff;
            color: #9880ff;
            -webkit-animation: dot-flashing 1s infinite alternate;
            animation: dot-flashing 1s infinite alternate;
            -webkit-animation-delay: 0s;
            animation-delay: 0s;
            content: '';
            display: inline-block;
            position: absolute;
            top: 0;
          }
          &:before {
            left: -15px;
          }
          &:after {
            left: 15px;
          }
        `}
        {...props}
      />
    </div>
  )
}

export default Loader
