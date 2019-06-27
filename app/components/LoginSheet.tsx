/** @jsx jsx */
import React from 'react'
import 'firebase/auth'
import { jsx, css } from '@emotion/core'
import { Sheet, Button } from 'sancho'
import Link from 'next/link'

interface Props {
  onRequestClose: () => void
  isOpen: boolean
}

const LoginSheet: React.SFC<Props> = ({ onRequestClose, isOpen }) => {
  return (
    <div>
      {/* SheetはwrapするdivがないとSSRで死ぬ */}
      <Sheet onRequestClose={onRequestClose} position="bottom" isOpen={isOpen}>
        <div
          css={css`
            padding: 20px 20px 0;
          `}
        >
          <p
            css={css`
              margin-bottom: 8px;
            `}
          >
            この機能を利用するにはログインしてください。
          </p>
          <Link href="/sign_in" passHref >
            <Button component="a" onPress={onRequestClose}>ログイン</Button>
          </Link>
          <span
            css={css`
              padding: 4px;
              display: inline-block;
            `}
          />
          <Link href="/sign_up" passHref>
            <Button component="a" onPress={onRequestClose}>会員登録</Button>
          </Link>
        </div>
      </Sheet>
    </div>
  )
}

export default LoginSheet
