/** @jsx jsx */
import Link from 'next/link'
import { jsx, css } from '@emotion/core'
import { getBooks } from '../../utils/functions'

import { Container, Button } from 'sancho'
import { withRouter } from 'next/router'
import Book from '../../utils/book'
import BookCell from '../../components/BookCell'
import { useState, useMemo, useContext } from 'react'
import UserContext from '../../contexts/UserContext'
import { initFirebase } from '../../utils/firebase'
import { media } from '../../utils/style'
import SectionHeader from '../../components/atoms/SectionHeader'

const Index = (props: { books: Book[]; router: any }) => {
  const { books, router } = props
  const { bookStars } = useContext(UserContext)
  const [isCheckOnly, setCheckOnly] = useState(router.query.starred !== undefined)

  const filteredBooks = useMemo(() => {
    if (isCheckOnly) {
      return props.books.filter((book: Book) => bookStars.includes(book.id))
    }
    return books
  }, [books, isCheckOnly, router.query])

  return (
    <div
      css={css`
        max-width: 720px;
        margin: 32px auto;
        padding: 0 16px;
        @media ${media.small} {
          padding-left: 0;
          padding-right: 0;
        }
      `}
    >
      <SectionHeader text="BOOKS" pageHeader>
        頒布物一覧
      </SectionHeader>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 24px;
        `}
      >
        <Button
          css={css`
            margin-bottom: 12px;
          `}
          onClick={() => {
            setCheckOnly(!isCheckOnly)
          }}
        >
          チェックリスト
        </Button>
      </div>
      {isCheckOnly && (
        <h1
          css={css`
            font-size: 24px;
            font-weight: bold;
            margin: 12px 0 24px;
          `}
        >
          チェック中の頒布物
        </h1>
      )}
      {filteredBooks.map((book: Book) => (
        <BookCell book={book} key={book.id} isShowCircle={true} />
      ))}
    </div>
  )
}

Index.getInitialProps = async ({ res }: any) => {
  if (res && res.setHeader) {
    res.setHeader('Cache-Control', 'public, s-maxage=360, stale-while-revalidate')
  }

  initFirebase()
  const books = await getBooks()
  return {
    books
  }
}
export default withRouter(Index)
