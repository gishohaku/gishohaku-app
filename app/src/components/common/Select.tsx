/** @jsxImportSource @emotion/react */
import React from 'react'
import { jsx, css } from '@emotion/react'
import { inputSizeStyles, errorInputStyles, focusShadow } from './formStyles'
import { alphaOf } from './colorUtils'
import { colors, text, getButtonHeight, Size } from './theme'
import { IconChevronDown } from './icons'
import { useInputGroup } from './InputGroupContext'

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  inputSize?: Size
}

export const Select: FCC<Props> = ({
  inputSize = 'md',
  multiple,
  id,
  ...other
}) => {
  const { uid, error } = useInputGroup()
  return (
    <div css={{ position: 'relative' }}>
      <select
        id={id || uid}
        multiple={multiple}
        css={[
          inputSizeStyles(inputSize),
          css`
            -webkit-appearance: none;
            display: block;
            width: 100%;
            line-height: 1.5;
            height: ${getButtonHeight(inputSize)};
            color: ${text.default};
            background: transparent;
            box-shadow: 0 0 0 2px transparent inset,
              0 0 0 1px ${alphaOf(colors.gray.dark, 0.2)} inset;
            border: none;
            background-clip: padding-box;
            border-radius: 0.25rem;
            margin: 0;

            :disabled {
              opacity: 0.8;
              cursor: not-allowed;
            }

            :focus {
              box-shadow: ${focusShadow()};
              outline: 0;
            }
          `,
          error ? errorInputStyles : undefined,
        ]}
        {...other}
      />
      {!multiple && (
        <IconChevronDown
          color={text.muted}
          css={{
            position: 'absolute',
            top: '50%',
            right: '0.75rem',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}
