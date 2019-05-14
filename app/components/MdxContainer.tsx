/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import Contents from './Contents'
import { Container } from 'sancho'

const MdxContainer = ({children}) => {
  return <Container css={css`
    max-width: ${48 + 740}px;
  `}>
    <Contents>
      {children}
    </Contents>
  </Container>
}

export default MdxContainer