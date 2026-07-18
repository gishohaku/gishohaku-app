/** @jsx jsx */
import React, { useState, useRef, useEffect } from 'react'
import { jsx, css } from '@emotion/react'
import { background, radii, spaces, zIndices, colors } from './theme'
import { alphaOf } from './colorUtils'

interface Props {
  content: React.ReactNode
  children: React.ReactElement
  placement?: 'bottom-end' | 'bottom-start'
}

// sancho の ResponsivePopover / Popper 相当を簡略化したもの。
// モバイル時のボトムシート切り替えは行わず、常に画面内アンカー型の
// ドロップダウンとして表示する(必要十分な操作性を優先)。
export const ResponsivePopover: React.FC<Props> = ({
  content,
  children,
  placement = 'bottom-end',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [isOpen])

  const trigger = React.cloneElement(children, {
    onPress: () => setIsOpen((open) => !open),
    'aria-expanded': isOpen,
    'aria-haspopup': true,
  })

  return (
    <div
      ref={wrapperRef}
      css={{ position: 'relative', display: 'inline-block' }}>
      {trigger}
      {isOpen && (
        <div
          role="dialog"
          css={css`
            position: absolute;
            top: 100%;
            ${placement === 'bottom-end' ? 'right: 0;' : 'left: 0;'}
            z-index: ${zIndices.popover};
            margin-top: ${spaces.sm};
            border-radius: ${radii.md};
            background: ${background.layer};
            box-shadow: 0 1px 10px 0 ${alphaOf(colors.gray.base, 0.15)},
              0 6px 12px 0 ${alphaOf(colors.gray.base, 0.1)};
          `}
          onClick={() => setIsOpen(false)}>
          {content}
        </div>
      )}
    </div>
  )
}
