/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react'

const FormContainer: FCC = (props) => {
  return (
    <div
      css={css`
        max-width: 740px;
        margin: 32px auto;
        padding: 24px;
        background-color: white;
        border-radius: 8px;
      `}>
      {props.children}
    </div>
  )
}

export default FormContainer
