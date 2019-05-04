import React from "react"
import { css } from "@emotion/core"
import { media, colors } from "src/utils/style"

export default props => {
  console.log(props)
  return (
    <div
      className={props.className}
      css={css`
        background-color: #f7f8fa;
        padding: 24px 20px 20px;
        border-radius: 8px;
      `}
    >
      <h2
        css={css`
          font-weight: 600;
          font-size: 18px;
          color: #1d272d;
          line-height: 1;
          margin-bottom: 8px;
        `}
      >
        スポンサー募集のご案内
      </h2>
      <p style={{ marginBottom: 8 }}>
        当会では、参加者により良いイベントを提供するため、ご協賛いただける企業を募集しております。
        詳細については以下の提案資料をご一読ください。
      </p>
      <a
        css={css`
          background-color: ${colors.accent};
          font-size: 14px;
          font-weight: bold;
          color: white;
          padding: 6px 24px;
          display: inline-block;
          border-radius: 30px;
          text-decoration: none;
          &:hover {
            transform: translateY(-1px);
            background-color: #dbae29;
          }
        `}
        href="/sponsor_2019.pdf"
      >
        スポンサー向け資料
      </a>
    </div>
  )
}
