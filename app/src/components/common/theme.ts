// sancho (https://github.com/bmcmahen/sancho) の light テーマから
// 実際に使用されている値のみを移植した定数群。
// 元の値は node_modules/sancho/esm/Theme/{index,colors,shadows,breakpoints}.js
// (open-color パレットベース) を参照して算出している。

export const colors = {
  gray: {
    lightest: '#f1f3f5',
    light: '#ced4da',
    base: '#343a40',
    dark: '#212529',
  },
  blue: {
    lightest: '#d0ebff',
    light: '#339af0',
    base: '#1971c2',
    dark: '#1864ab',
  },
  red: {
    lightest: '#ffe3e3',
    light: '#fa5252',
    base: '#e03131',
    dark: '#c92a2a',
  },
}

export const intent = {
  none: colors.gray,
  primary: colors.blue,
  danger: colors.red,
}

export const text = {
  default: colors.gray.dark,
  heading: colors.gray.dark,
  muted: '#5F6871',
  selected: colors.blue.base,
}

export const background = {
  tint1: colors.gray.lightest,
  tint2: '#dee2e6',
  overlay: 'hsla(210, 10.8%, 14.5%, 0.6)',
  layer: 'white',
  default: 'white',
}

export const border = {
  default: 'hsla(210, 10.8%, 14.5%, 0.12)',
  muted: 'hsla(210, 10.8%, 14.5%, 0.08)',
}

export const spaces = {
  none: '0',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '3rem',
}

export const fontSizes = [
  '0.875rem',
  '1rem',
  '1.25rem',
  '1.5rem',
  '1.75rem',
  '2rem',
  '2.5rem',
  '3.5rem',
  '4.5rem',
  '5.5rem',
]

export const radii = {
  sm: '0.25rem',
  md: '0.4rem',
  lg: '1rem',
}

export const iconSizes = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
}

export const zIndices = {
  overlay: 1040,
  modal: 1050,
  popover: 1060,
}

export const mediaQueries = {
  sm: '@media (min-width: 567px)',
  md: '@media (min-width: 768px)',
  lg: '@media (min-width: 992px)',
  xl: '@media (min-width: 1200px)',
}

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const getButtonHeight = (size: Size = 'md') => {
  if (size === 'xs') return '25px'
  if (size === 'sm') return '30px'
  if (size === 'lg') return '48px'
  if (size === 'xl') return '60px'
  return '40px'
}

export const getButtonPadding = (size: Size = 'md') => {
  if (size === 'xs') return '0 0.5rem'
  if (size === 'sm') return '0 0.8rem'
  if (size === 'lg') return '0 1.5rem'
  if (size === 'xl') return '0 2.2rem'
  return '0 1rem'
}

export const getButtonFontSize = (size: Size = 'md') => {
  if (size === 'xs') return fontSizes[0]
  if (size === 'sm') return fontSizes[0]
  if (size === 'lg') return fontSizes[2]
  if (size === 'xl') return fontSizes[3]
  return fontSizes[1]
}

export const getInputSize = (size: Size = 'md') => {
  if (size === 'sm') return { fontSize: fontSizes[0], padding: '0.25rem 0.5rem' }
  if (size === 'lg') return { fontSize: fontSizes[2], padding: '0.65rem 1rem' }
  return { fontSize: fontSizes[1], padding: '0.5rem 0.75rem' }
}
