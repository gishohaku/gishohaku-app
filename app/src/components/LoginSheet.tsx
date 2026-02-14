/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { jsx, css } from '@emotion/react'
import { Sheet, Button } from 'sancho'

interface Props {
  onRequestClose: () => void
  isOpen: boolean
}

const buttonLink = css`
  text-decoration: none;
`

const LoginSheet: React.FC<Props> = ({ onRequestClose, isOpen }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div>
      {mounted && (
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
      )}
    </div>
  )
}

export default LoginSheet
