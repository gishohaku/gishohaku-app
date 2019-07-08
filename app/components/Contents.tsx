import styled from '@emotion/styled'

export default styled.div`
  margin-top: 12px;
  color: #444;
  word-break: break-all;

  p,
  ul,
  ol {
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: bold;
    color: #222;
    margin-bottom: 4px;
  }

  strong {
    font-weight: bold;
    color: #222;
  }

  ul,
  ol {
    padding-left: 24px;
  }

  ul li {
    list-style-type: disc;
  }

  ol li {
    list-style-type: decimal;
  }

  table {
    border: 1px solid rgba(0, 0, 0, 0.1);
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    margin: 12px 0;
  }

  table tr:nth-child(odd) td {
    background-color: #f9f9f9;
  }

  table tr th,
  table tr td {
    padding: 8px;
    line-height: 1.6;
    vertical-align: top;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  table tr th {
    white-space: nowrap;
  }
`
