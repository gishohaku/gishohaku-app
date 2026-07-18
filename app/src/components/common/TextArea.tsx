/** @jsx jsx */
import React from 'react'
import { jsx } from '@emotion/react'
import { baseInputStyles, inputSizeStyles, errorInputStyles } from './formStyles'
import { Size } from './theme'
import { useInputGroup } from './InputGroupContext'

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  inputSize?: Size
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ inputSize = 'md', id, ...other }, ref) => {
    const { uid, error } = useInputGroup()
    return (
      <textarea
        ref={ref}
        id={id || uid}
        css={[
          baseInputStyles,
          inputSizeStyles(inputSize),
          { overflow: 'auto', resize: 'vertical' },
          error && errorInputStyles,
        ]}
        {...other}
      />
    )
  },
)
TextArea.displayName = 'TextArea'
