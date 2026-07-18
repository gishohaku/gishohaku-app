/** @jsx jsx */
import React from 'react'
import { jsx, css } from '@emotion/react'
import {
  Size,
  colors,
  intent as intentColors,
  text as textColors,
  getButtonHeight,
  getButtonPadding,
  getButtonFontSize,
  radii,
  spaces,
} from './theme'
import { alphaOf } from './colorUtils'
import { Spinner } from './Spinner'

type Variant = 'default' | 'ghost' | 'outline'
type Intent = 'none' | 'primary' | 'danger'

function gradient(start: string, end: string) {
  return `linear-gradient(to top, ${start}, ${end})`
}

function insetShadow(from: string, to: string) {
  return `inset 0 0 0 1px ${from}, inset 0 -1px 1px 0 ${to}`
}

const shadowGray20 = 'hsla(210, 10.8%, 14.5%, 0.2)'
const shadowGray10 = 'hsla(210, 10.8%, 14.5%, 0.1)'
const shadowGray07 = 'hsla(210, 10.8%, 14.5%, 0.07)'
const shadowGray05 = 'hsla(210, 10.8%, 14.5%, 0.05)'
const shadowGray15 = 'hsla(210, 10.8%, 14.5%, 0.15)'

// lighten(color.blue.base, 0.4) / lighten(color.red.base, 0.3) (色は node の
// `color` パッケージで算出。theme.ts 参照)
const gradientEnd: Record<Exclude<Intent, 'none'>, string> = {
  primary: '#4B9DE8',
  danger: '#EB7878',
}

const getIntentStyles = (intent: Intent) => {
  if (intent === 'none') {
    return css`
      background-color: white;
      color: ${textColors.default};
      background: ${gradient(colors.gray.lightest, 'white')};
      box-shadow: ${insetShadow(shadowGray20, shadowGray10)};
    `
  }
  const palette = intentColors[intent]
  return css`
    background-color: ${palette.base};
    color: white;
    background-image: ${gradient(palette.base, gradientEnd[intent])};
    box-shadow: ${insetShadow(shadowGray20, shadowGray20)};
  `
}

const ghostIntents = (intent: Intent) => {
  const none = intent === 'none'
  const base = none ? textColors.default : intentColors[intent].base
  return css`
    color: ${none ? textColors.muted : base};
    opacity: 1;
    background: transparent;
    box-shadow: none;
    transition: box-shadow 0.07s cubic-bezier(0.35, 0, 0.25, 1),
      background 0.07s cubic-bezier(0.35, 0, 0.25, 1);

    &:hover {
      background: ${none ? shadowGray07 : alphaOf(base, 0.07)};
    }
    &:active {
      background: ${none ? shadowGray15 : alphaOf(base, 0.15)};
    }
  `
}

const outlineIntents = (intent: Intent) => {
  const none = intent === 'none'
  const base = none ? textColors.default : intentColors[intent].base
  return css`
    color: ${base};
    border: 1px solid ${none ? shadowGray20 : alphaOf(base, 0.2)};
    box-shadow: none;
    background: none;
    transition: box-shadow 0.07s cubic-bezier(0.35, 0, 0.25, 1),
      background 0.07s cubic-bezier(0.35, 0, 0.25, 1);

    &:hover {
      background: ${none ? shadowGray05 : alphaOf(base, 0.05)};
    }
    &:active {
      background: ${none ? shadowGray15 : alphaOf(base, 0.15)};
    }
  `
}

const getIntent = (variant: Variant, intent: Intent) => {
  switch (variant) {
    case 'ghost':
      return ghostIntents(intent)
    case 'outline':
      return outlineIntents(intent)
    default:
      return getIntentStyles(intent)
  }
}

export interface ButtonProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
  variant?: Variant
  intent?: Intent
  size?: Size
  block?: boolean
  disabled?: boolean
  loading?: boolean
  component?: React.ElementType
  iconBefore?: React.ReactNode
  iconAfter?: React.ReactNode
  onPress?: (e: React.SyntheticEvent) => void
  href?: string
  target?: string
  rel?: string
  to?: string
  type?: string
}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    {
      size = 'md',
      block,
      variant = 'default',
      intent = 'none',
      disabled = false,
      loading = false,
      component,
      iconBefore,
      iconAfter,
      children,
      onPress,
      onClick,
      type,
      ...other
    },
    ref,
  ) => {
    let Component: React.ElementType = component || 'div'
    if (type === 'submit' && Component === 'div') {
      Component = 'button'
    }

    return (
      <Component
        ref={ref}
        role={other.href ? 'link' : 'button'}
        tabIndex={0}
        type={type}
        disabled={Component === 'button' ? disabled : undefined}
        onClick={(e: React.SyntheticEvent) => {
          if (onPress) onPress(e)
          if (onClick) onClick(e as any)
        }}
        css={[
          css`
            text-decoration: none;
            background: none;
            white-space: nowrap;
            -webkit-appearance: none;
            box-sizing: border-box;
            text-align: center;
            border: none;
            user-select: none;
            cursor: pointer;
            box-shadow: none;
            width: ${block ? '100%' : undefined};
            font-weight: 500;
            position: relative;
            border-radius: ${radii.sm};
            font-size: ${getButtonFontSize(size)};
            padding: ${getButtonPadding(size)};
            height: ${getButtonHeight(size)};
            display: ${block ? 'flex' : 'inline-flex'};
            align-items: center;
            justify-content: center;

            &:focus {
              outline: 3px auto rgba(51, 154, 240, 0.8);
            }
          `,
          variant === 'ghost' &&
            css`
              background: transparent;
              box-shadow: none;
            `,
          getIntent(variant, intent),
          disabled &&
            css`
              opacity: 0.6;
              pointer-events: none;
            `,
          loading &&
            css`
              & > :not(.Spinner) {
                opacity: 0;
                transition: opacity 0.1s ease;
              }
            `,
          iconBefore &&
            css`
              padding-left: 0.65rem;
            `,
          iconAfter &&
            css`
              padding-right: 0.65rem;
            `,
        ]}
        {...other}>
        {loading && (
          <div
            className="Spinner"
            css={css`
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            `}>
            <Spinner size={size} />
          </div>
        )}
        {iconBefore && (
          <span
            aria-hidden
            css={css`
              display: inline-flex;
              margin-right: ${spaces.sm};
            `}>
            {iconBefore}
          </span>
        )}
        {typeof children === 'string' ? (
          <span aria-hidden={loading} css={css({ flex: 1 })}>
            {children}
          </span>
        ) : (
          children
        )}
        {iconAfter && (
          <span
            aria-hidden
            css={css`
              display: inline-flex;
              margin-left: ${spaces.sm};
            `}>
            {iconAfter}
          </span>
        )}
      </Component>
    )
  },
)
Button.displayName = 'Button'
