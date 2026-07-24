/** @jsxImportSource @emotion/react */
import React from 'react'
import { jsx } from '@emotion/react'
import { Text } from './Text'
import { spaces } from './theme'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

let uidCounter = 0

export const Check: FCC<Props> = ({
  label,
  id,
  disabled,
  ...other
}) => {
  const uidRef = React.useRef<string | undefined>(undefined)
  if (!uidRef.current) {
    uidCounter += 1
    uidRef.current = id || `check-${uidCounter}`
  }
  const uid = uidRef.current

  return (
    <div css={{ display: 'flex', alignItems: 'center' }}>
      <input disabled={disabled} type="checkbox" id={uid} {...other} />
      <label
        css={{ opacity: disabled ? 0.6 : undefined, marginLeft: spaces.xs }}
        htmlFor={uid}>
        <Text>{label}</Text>
      </label>
    </div>
  )
}
