/** @jsx jsx */
import React from 'react'
import { jsx, css } from '@emotion/core'
import { Sheet, Button } from 'sancho'

interface Props {
  onRequestClose: () => void
  isOpen: boolean
}

const buttonLink = css`
  text-decoration: none;
`

const LoginSheet: React.SFC<Props> = ({ onRequestClose, isOpen }) => {
  return (
    <div>
      {/* SheetはwrapするdivがないとSSRで死ぬ */}
      <Sheet onRequestClose={onRequestClose} position="bottom" isOpen={isOpen}>
        <div
          css={css`
            padding: 20px 20px 0;
          `}>
          <p
            css={css`
              margin-bottom: 8px;
            `}>
            この機能を利用するにはログインしてください。
          </p>
          <a href="/sign_in" css={buttonLink}>
            <Button>ログイン</Button>
          </a>
          <span
            css={css`
              padding: 4px;
              display: inline-block;
            `}
          />
          <a href="/sign_up" css={buttonLink}>
            <Button>会員登録</Button>
          </a>
        </div>
      </Sheet>
    </div>
  )
}

export default LoginSheet
