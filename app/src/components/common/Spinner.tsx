/** @jsxImportSource @emotion/react */
import { jsx, css, keyframes } from '@emotion/react'
import { Size } from './theme'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const sizeStyles: Record<Size, ReturnType<typeof css>> = {
  xs: css({ width: '0.5rem', height: '0.5rem' }),
  sm: css({ width: '0.75rem', height: '0.75rem' }),
  md: css({ width: '1rem', height: '1rem' }),
  lg: css({ width: '1.25rem', height: '1.25rem' }),
  xl: css({ width: '1.5rem', height: '1.5rem' }),
}

export const Spinner: FCC<{ size?: Size; className?: string }> = ({
  size = 'md',
  className,
}) => {
  return (
    <div className={className} role="status">
      <div
        css={[
          css`
            display: inline-block;
            vertical-align: text-bottom;
            border: 0.15em solid currentColor;
            border-right-color: transparent;
            border-radius: 50%;
            animation: ${spin} 0.75s linear infinite;
          `,
          sizeStyles[size],
        ]}
      />
    </div>
  )
}
