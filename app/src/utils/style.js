export const colors = {
  primary: '#2B5773',
  primaryDarker: '#204986',
  gray900: '#1D272D',
  gray700: '#505A60',
  gray100: '#F7F8FA',
  accent: '#ECB40D',
}

const breakpoints = {
  small: 480,
  medium: 768,
  large: 980,
}

export const media = {
  small: `screen and (max-width: ${breakpoints.small - 1}px)`,
  medium: `screen and (max-width: ${breakpoints.medium - 1}px)`,
  large: `screen and (max-width: ${breakpoints.large - 1}px)`,
}
