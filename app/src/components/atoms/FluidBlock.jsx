/** @jsx jsx */

import React from "react"
import { jsx, css } from "@emotion/core"
import { media } from "../../utils/style"

const paragraphBlock = css`
max-width: 100%;
margin: 32px auto;
padding: 0;
`

const FluidBlock = ({children}) => <div css={paragraphBlock}>{children}</div>;

export default FluidBlock;
