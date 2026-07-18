/** @jsxImportSource @emotion/react */
import React from 'react'
import { jsx } from '@emotion/react'
import { Button, ButtonProps } from './Button'
import { getButtonHeight } from './theme'

interface Props extends ButtonProps {
  label: string
  icon: React.ReactElement
  color?: string
}

export const IconButton = React.forwardRef<HTMLElement, Props>(
  ({ label, size = 'md', icon, color = 'currentColor', ...other }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        css={{
          padding: 0,
          width: getButtonHeight(size),
        }}
        {...other}>
        <span
          css={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}>
          {label}
        </span>
        {React.cloneElement(icon as React.ReactElement<any>, {
          color,
          size,
          'aria-hidden': true,
        })}
      </Button>
    )
  },
)
IconButton.displayName = 'IconButton'
