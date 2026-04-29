/** @jsx jsx */
import { jsx, css, Global } from '@emotion/core'
import Contents from './MdxContents'
import { Container } from './common/Container'

const MdxContainer: React.SFC = ({ children }) => {
  return (
    <Container
      css={css`
        margin: 32px auto;
        max-width: ${48 + 740}px;
        .button {
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f0f0f0;
          color: #444444;
          line-height: 4rem;
          padding: 8px 16px;
          text-decoration: none;
        }
        .button:active,
        .button:focus,
        .button:hover {
          background-color: #e7e7e7;
        }

        .button.primary {
          border: 1px solid #516c9d;
          background-color: #ffffff;
          color: #516c9d;
        }
        .button.primary:active,
        .button.primary:focus,
        .button.primary:hover {
          border: 1px solid #516c9d;
          background-color: #516c9d;
          color: #ffffff;
        }
      `}>
      <Global
        styles={{
          body: {
            backgroundColor: 'white',
          },
        }}
      />
      <Contents>{children}</Contents>
    </Container>
  )
}

export default MdxContainer
