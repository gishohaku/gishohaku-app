/** @jsxImportSource @emotion/react */
import React from 'react'
import { jsx, css } from '@emotion/react'
import { Text } from './Text'
import { InputGroupProvider } from './InputGroupContext'
import { spaces, text, colors, fontSizes } from './theme'

let uidCounter = 0

interface Props {
  id?: string
  label: string
  error?: string | React.ReactNode
  helpText?: string
  hideLabel?: boolean
  className?: string
}

export const InputGroup: FCC<Props> = ({
  id,
  label,
  children,
  error,
  helpText,
  hideLabel,
  ...other
}) => {
  const uidRef = React.useRef<string>()
  if (!uidRef.current) {
    uidCounter += 1
    uidRef.current = id || `input-group-${uidCounter}`
  }
  const uid = uidRef.current

  return (
    <div
      className="InputGroup"
      css={css`
        margin-top: ${spaces.md};
        :first-of-type {
          margin-top: 0;
        }
      `}
      {...other}>
      <label
        htmlFor={uid}
        css={{
          display: 'inline-block',
          marginBottom: hideLabel ? 0 : spaces.sm,
          ...(hideLabel
            ? {
                position: 'absolute',
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                border: 0,
              }
            : {}),
        }}>
        <Text variant="subtitle" component="span">
          {label}
        </Text>
      </label>
      <InputGroupProvider value={{ uid, error }}>
        {children}
      </InputGroupProvider>
      {error && typeof error === 'string' ? (
        <Text
          css={{
            display: 'block',
            marginTop: spaces.sm,
            fontSize: fontSizes[0],
            color: colors.red.base,
          }}>
          {error}
        </Text>
      ) : (
        error
      )}
      {helpText && (
        <Text
          css={{
            display: 'block',
            marginTop: spaces.xs,
            color: text.muted,
            fontSize: fontSizes[0],
          }}
          variant="body">
          {helpText}
        </Text>
      )}
    </div>
  )
}
