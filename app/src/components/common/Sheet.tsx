/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef } from 'react'
import { jsx, css } from '@emotion/react'
import { RemoveScroll } from 'react-remove-scroll'
import { Portal } from '../Portal'
import { background, radii, spaces, zIndices, mediaQueries } from './theme'

type Position = 'left' | 'right' | 'top' | 'bottom'

interface Props {
  isOpen: boolean
  onRequestClose: () => void
  position?: Position
  className?: string
}

const closedTransform: Record<Position, string> = {
  left: 'translateX(-100%)',
  right: 'translateX(100%)',
  top: 'translateY(-100%)',
  bottom: 'translateY(100%)',
}

const positionStyles = (position: Position) => {
  switch (position) {
    case 'left':
      return css`
        top: 0;
        left: 0;
        bottom: 0;
        width: auto;
        max-width: 100vw;
        ${mediaQueries.md} {
          max-width: 400px;
        }
      `
    case 'right':
      return css`
        top: 0;
        right: 0;
        bottom: 0;
        width: auto;
        max-width: 100vw;
        ${mediaQueries.md} {
          max-width: 400px;
        }
      `
    case 'top':
      return css`
        top: 0;
        left: 0;
        right: 0;
        height: auto;
        width: 100%;
        ${mediaQueries.md} {
          max-height: 400px;
        }
        & > div {
          border-bottom-right-radius: ${radii.lg};
          border-bottom-left-radius: ${radii.lg};
          padding-top: ${spaces.md};
          padding-bottom: ${spaces.xs};
        }
      `
    case 'bottom':
      return css`
        bottom: 0;
        left: 0;
        right: 0;
        height: auto;
        width: 100%;
        ${mediaQueries.md} {
          max-height: 400px;
        }
        & > div {
          border-top-right-radius: ${radii.lg};
          border-top-left-radius: ${radii.lg};
          padding-top: ${spaces.xs};
          padding-bottom: ${spaces.lg};
        }
      `
  }
}

export const Sheet: FCC<Props> = ({
  isOpen,
  onRequestClose,
  position = 'right',
  children,
  ...other
}) => {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onRequestClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onRequestClose])

  return (
    <Portal>
      <div
        aria-hidden={!isOpen}
        onClick={onRequestClose}
        css={css`
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          z-index: ${zIndices.overlay};
          background: ${background.overlay};
          opacity: ${isOpen ? 1 : 0};
          visibility: ${isOpen ? 'visible' : 'hidden'};
          pointer-events: ${isOpen ? 'auto' : 'none'};
          transition: opacity 0.2s cubic-bezier(0.35, 0, 0.25, 1),
            visibility 0.2s;
        `}
      />
      <div
        ref={sheetRef}
        className="Sheet"
        onClick={(e) => e.stopPropagation()}
        css={[
          css`
            position: fixed;
            z-index: ${zIndices.modal};
            outline: none;
            visibility: ${isOpen ? 'visible' : 'hidden'};
            pointer-events: ${isOpen ? 'auto' : 'none'};
            transform: ${isOpen ? 'translate(0, 0)' : closedTransform[position]};
            transition: transform 0.25s cubic-bezier(0.35, 0, 0.25, 1),
              visibility 0.25s;
          `,
          positionStyles(position),
        ]}
        {...other}>
        <RemoveScroll enabled={isOpen} forwardProps>
          <div
            css={{
              background: background.layer,
              height: '100%',
              overflowY: 'auto',
              overscrollBehavior: 'contain',
            }}>
            {children}
          </div>
        </RemoveScroll>
      </div>
    </Portal>
  )
}
