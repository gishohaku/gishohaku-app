/** @jsx jsx */
import Link from 'next/link'
import { jsx, css } from '@emotion/core'
import { getBooks } from '../../utils/functions'

import {
  Container
} from 'sancho'
import { withRouter } from 'next/router'
import Book from '../../utils/book'
import BookCell from '../../components/BookCell'

const Index = (props: any) => {
  return (
    <Container css={css`
      max-width: 720px;
      margin-top: 32px;
    `}>
      {props.books.map((book: Book) => (<BookCell book={book} key={book.id} />))}
    </Container>
  )
}

Index.getInitialProps = async ({ res }: any) => {
  if (res && res.setHeader) {
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate')
  }

  const books = await getBooks()
  return {
    books
  }
}
export default withRouter(Index)
