/** @jsx jsx */
import { Spinner } from 'sancho'
import { jsx, css } from '@emotion/core'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The delay (in ms) before the spinner will appear */
  delay?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Attempt to center the spinner in the parent element */
  center?: boolean;
  /** Use an optional label */
  label?: string;
}

const Loader : React.FC<SpinnerProps> = (props: any) => {
  return <Spinner size='xl' center css={css`
    position: absolute;
    color: #2B5773;
  `} {...props} />
}

export default Loader
