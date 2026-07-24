import React from 'react'
import { iconSizes, text, Size } from '../theme'

export interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: Size | number
  color?: string
}

export const createIcon = (
  paths: React.ReactNode,
): FCC<IconProps> => ({
  color,
  size = 'md',
  ...other
}) => {
  const resolvedSize = typeof size === 'string' ? iconSizes[size] : size
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || text.default}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      height={resolvedSize}
      width={resolvedSize}
      aria-hidden
      {...other}>
      {paths}
    </svg>
  )
}
