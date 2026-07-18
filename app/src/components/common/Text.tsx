/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { fontSizes, text as textColors } from './theme'

type Variant =
  | 'body'
  | 'paragraph'
  | 'subtitle'
  | 'h6'
  | 'h5'
  | 'h4'

const element: Record<Variant, string> = {
  body: 'span',
  paragraph: 'p',
  subtitle: 'div',
  h6: 'h6',
  h5: 'h5',
  h4: 'h4',
}

const getVariantStyles = (variant: Variant) => {
  switch (variant) {
    case 'paragraph':
      return css({ fontSize: fontSizes[1], marginBottom: '1rem' })
    case 'subtitle':
      return css({
        fontSize: fontSizes[0],
        fontWeight: 400,
        color: textColors.muted,
        lineHeight: 1.5,
      })
    case 'h6':
      return css({
        color: textColors.heading,
        fontWeight: 500,
        lineHeight: 1.5,
        fontSize: fontSizes[1],
        marginBottom: '0.5rem',
      })
    case 'h5':
      return css({
        color: textColors.heading,
        fontWeight: 500,
        fontSize: fontSizes[2],
        lineHeight: 1.2,
        marginBottom: '0.5rem',
      })
    case 'h4':
      return css({
        color: textColors.heading,
        fontWeight: 500,
        fontSize: fontSizes[3],
        lineHeight: 1.2,
        marginBottom: '0.5rem',
        letterSpacing: '-0.2px',
      })
    default:
      return css({ fontSize: fontSizes[1] })
  }
}

interface Props extends React.HTMLAttributes<HTMLElement> {
  variant?: Variant
  muted?: boolean
  wrap?: boolean
  component?: React.ElementType
  htmlFor?: string
}

export const Text: React.FC<Props> = ({
  variant = 'body',
  wrap = true,
  muted,
  component,
  children,
  ...other
}) => {
  const Component = component || element[variant]
  return (
    <Component
      css={[
        css`
          box-sizing: border-box;
          margin: 0;
          font-weight: 400;
          line-height: 1.5;
          font-size: ${fontSizes[1]};
          color: ${textColors.default};
          -webkit-font-smoothing: antialiased;
        `,
        !wrap &&
          css`
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          `,
        muted && css({ color: textColors.muted }),
        getVariantStyles(variant),
      ]}
      {...other}>
      {children}
    </Component>
  )
}
