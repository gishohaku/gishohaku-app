/** @jsxImportSource @emotion/react */
import React from 'react'
import { jsx, css } from '@emotion/react'
import { spaces, background, text } from './theme'

export const MenuList: FCC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  ...other
}) => {
  return (
    <div
      role="menu"
      css={{
        minWidth: '200px',
        display: 'block',
        padding: `${spaces.sm} 0`,
      }}
      {...other}>
      {children}
    </div>
  )
}

interface MenuItemProps extends React.HTMLAttributes<HTMLElement> {
  contentBefore?: React.ReactNode
  onPress?: (e: React.SyntheticEvent) => void
}

export const MenuItem: FCC<MenuItemProps> = ({
  contentBefore,
  onPress,
  onClick,
  children,
  ...other
}) => {
  return (
    <div
      role="menuitem"
      tabIndex={0}
      onClick={(e) => {
        if (onPress) onPress(e)
        if (onClick) onClick(e)
      }}
      css={css`
        cursor: pointer;
        padding: ${spaces.sm} ${spaces.md};
        display: flex;
        align-items: center;
        color: ${text.default};
        transition: background-color 0.1s ease;

        :hover {
          background: ${background.tint1};
        }
        :active {
          background: ${background.tint2};
        }
      `}
      {...other}>
      {contentBefore && (
        <span css={{ display: 'inline-flex', marginRight: spaces.md }}>
          {contentBefore}
        </span>
      )}
      <span css={{ flex: 1 }}>{children}</span>
    </div>
  )
}
