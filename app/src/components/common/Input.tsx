/** @jsxImportSource @emotion/react */
import React from 'react'
import { jsx } from '@emotion/react'
import { baseInputStyles, inputSizeStyles, errorInputStyles } from './formStyles'
import { getButtonHeight, Size } from './theme'
import { useInputGroup } from './InputGroupContext'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: Size
}

export const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ inputSize = 'md', id, ...other }, ref) => {
    const { uid, error } = useInputGroup()
    return (
      <input
        ref={ref}
        id={id || uid}
        css={[
          baseInputStyles,
          inputSizeStyles(inputSize),
          { height: getButtonHeight(inputSize) },
          error ? errorInputStyles : undefined,
        ]}
        {...other}
      />
    )
  },
)
Input.displayName = 'Input'
