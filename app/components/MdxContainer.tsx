/** @jsx jsx */
import { jsx, css, Global } from '@emotion/core'
import Contents from './Contents'
import { Container } from 'sancho'

const MdxContainer = ({children}) => {
  return <Container css={css`
    margin: 32px auto;
    max-width: ${48 + 740}px;
  `}>
    <Global styles={{
      body: {
        backgroundColor: 'white'
      }
    }} />
    <Contents>
      {children}
    </Contents>
  </Container>
}

export default MdxContainer