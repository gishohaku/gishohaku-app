import { css } from '@emotion/react'
import { alphaOf } from './colorUtils'
import { colors, text, background, radii, Size, getInputSize } from './theme'

function shadowBorder(color: string, opacity: number) {
  return `0 0 0 2px transparent inset, 0 0 0 1px ${alphaOf(
    color,
    opacity,
  )} inset`
}

export function focusShadow() {
  return `0 0 0 3px ${alphaOf(colors.blue.dark, 0.1)}, inset 0 0 0 1px ${alphaOf(
    colors.gray.dark,
    0.2,
  )}, inset 0 -1px 1px 0 ${alphaOf(colors.gray.dark, 0.05)}`
}

export const baseInputStyles = css`
  display: block;
  width: 100%;
  line-height: 1.5;
  color: ${text.default};
  background-color: transparent;
  background-image: none;
  background-clip: padding-box;
  -webkit-font-smoothing: antialiased;
  -webkit-appearance: none;
  box-sizing: border-box;
  border: none;
  box-shadow: ${shadowBorder(colors.gray.dark, 0.2)};
  border-radius: ${radii.sm};
  transition: background 0.25s cubic-bezier(0.35, 0, 0.25, 1),
    box-shadow 0.15s cubic-bezier(0.35, 0, 0.25, 1);

  ::placeholder {
    color: ${alphaOf(colors.gray.dark, 0.45)};
  }

  :focus {
    box-shadow: ${focusShadow()};
    outline: none;
  }

  :disabled {
    opacity: 0.8;
    background: ${background.tint1};
    cursor: not-allowed;
    box-shadow: ${shadowBorder(colors.gray.dark, 0.12)};
  }

  :active {
    background: ${background.tint1};
  }
`

export const errorInputStyles = css`
  box-shadow: ${shadowBorder(colors.red.base, 0.45)};
`

export const inputSizeStyles = (size: Size) => {
  const { fontSize, padding } = getInputSize(size)
  return css({ fontSize, padding })
}
