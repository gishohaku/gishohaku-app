/** @jsx jsx */
import React from 'react'
import { jsx, css } from '@emotion/core'
import { Text } from './Text'
import { spaces, background, fontSizes, mediaQueries, text as textColors } from './theme'

export const List: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  ...other
}) => {
  return <nav {...other}>{children}</nav>
}

interface ListItemProps extends React.HTMLAttributes<HTMLElement> {
  primary: React.ReactNode
  secondary?: React.ReactNode
  contentBefore?: React.ReactNode
  contentAfter?: React.ReactNode
  interactive?: boolean
  component?: React.ElementType
}

export const ListItem: React.FC<ListItemProps> = ({
  primary,
  secondary,
  contentBefore,
  contentAfter,
  interactive = true,
  component,
  ...other
}) => {
  const Component = component || 'div'
  return (
    <Component
      className="ListItem"
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      css={css`
        display: block;
        text-decoration: none;
        outline: none;
        padding: ${spaces.md};
        background: transparent;
        transition: background 0.07s ease;

        ${mediaQueries.md} {
          padding-left: ${spaces.lg};
          padding-right: ${spaces.lg};
        }

        ${interactive &&
          css`
            cursor: pointer;

            :hover {
              background: ${background.tint1};
            }

            :active {
              background: ${background.tint2};
            }

            :focus {
              box-shadow: inset 0 0 3px ${textColors.selected};
            }
          `}
      `}
      {...other}>
      <div css={{ display: 'flex', alignItems: 'center' }}>
        {contentBefore && (
          <div css={{ marginRight: spaces.md }}>{contentBefore}</div>
        )}
        <div css={{ flex: 1, overflow: 'hidden' }}>
          <Text
            wrap
            variant="body"
            css={{ display: 'block', fontWeight: 500 }}>
            {primary}
          </Text>
          {secondary && (
            <Text
              wrap
              muted
              variant="body"
              css={{ display: 'block', fontSize: fontSizes[0] }}>
              {secondary}
            </Text>
          )}
        </div>
        {contentAfter && (
          <div css={{ flex: '0 0 auto', marginLeft: spaces.md }}>
            {contentAfter}
          </div>
        )}
      </div>
    </Component>
  )
}
