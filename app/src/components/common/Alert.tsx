/** @jsxImportSource @emotion/react */
import React from 'react'
import { jsx, css } from '@emotion/react'
import { Text } from './Text'
import { colors, background, spaces, radii, fontSizes } from './theme'
import { alphaOf } from './colorUtils'
import { IconAlertOctagon } from './icons'

type Intent = 'info' | 'danger'

const intentColor: Record<Intent, string> = {
  info: colors.gray.base,
  danger: colors.red.base,
}

// createShadows(gray[8]).xs (node_modules/sancho/esm/Theme/shadows.js 参照)
const shadowXs = `0 0 1px ${alphaOf(colors.gray.base, 0.1)}, 0 0 1px 1px ${alphaOf(
  colors.gray.base,
  0.12,
)}`

interface Props {
  title?: string
  subtitle?: string
  intent?: Intent
  className?: string
}

export const Alert: FCC<Props> = ({
  title,
  subtitle,
  intent = 'info',
  children,
  ...other
}) => {
  const accent = intentColor[intent]
  return (
    <div
      className="Alert"
      css={css`
        background-color: ${background.default};
        overflow: hidden;
        position: relative;
        box-shadow: ${shadowXs};
        border-radius: ${radii.md};
      `}
      {...other}>
      <div
        css={{
          width: radii.md,
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          backgroundColor: accent,
        }}
      />
      <div
        css={{
          display: 'flex',
          alignItems: 'flex-start',
          padding: `${spaces.md} ${spaces.md}`,
        }}>
        {title ? (
          <React.Fragment>
            <div css={{ flex: '0 0 auto', marginTop: '2px' }}>
              <IconAlertOctagon size="md" color={accent} />
            </div>
            <div css={{ marginLeft: spaces.md }}>
              <Text css={{ margin: 0 }} variant="h6">
                {title}
              </Text>
              {subtitle && (
                <Text muted css={{ fontSize: fontSizes[0] }}>
                  {subtitle}
                </Text>
              )}
              {children}
            </div>
          </React.Fragment>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
