/** @jsx jsx */
import Link from 'next/link'

import { jsx, css, Global } from '@emotion/core'
import marked from 'marked'

import Book, { types, mediums } from '../utils/book'
import ImageBox from '../components/ImageBox';
import Label from '../components/Label';

interface Props {
  book: Book
  editable?: boolean
}

const BookCell: React.SFC<Props> = ({ book, editable = false }) => {
  const metadata = [
    book.type && `${types[book.type]}`,
    book.pages > 0 && `${book.pages}ページ`,
    book.stock > 0 && `${book.stock}部頒布`,
    book.medium && `${mediums[book.medium]}`,
    book.price > 0 && `${String(book.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}円`
  ].filter(el => el)
  return <div css={css`
      background-color: white;
      margin-bottom: 20px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
    `} key={book.id}>
    <div css={css`
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      `}>
      <div>
        <div css={css`
            font-size: 20px;
            font-weight: bold;
          `}>
          {book.title}
        </div>
        <div css={css`
            font-size: 13px;
          `}>
          {book.isNew && <Label backgroundColor={'#ECB40D'} color={'white'} text='新刊' />}
          <span css={css`
              opacity: 0.8;
            `}>
            {metadata.join("・")}
          </span>
        </div>
      </div>
      {editable &&
        <Link href={`/books/edit?id=${book.id}`} as={`/books/${book.id}/edit`} passHref>
          <a css={css`
              margin-left: auto;
              border: 1px solid #2A5773;
              text-decoration: none;
              padding: 6px 20px;
              border-radius: 4px;
              font-size: 15px;
              font-weight: 600;
              color: #2A5773;
              transition: all .2s ease;
              white-space: nowrap;
              &:hover {
                background-color: #2A5773;
                color: white;
              }
            `}>
            編集
            </a>
        </Link>
      }
    </div>
    <div css={css`
        overflow-x: auto;
        margin: 0 -20px;
        padding: 0 20px;
      `}>
      <div css={css`
          display: flex;
        `}>
        {
          book.images.map((image, index) => {
            return <ImageBox imageUrl={image} size='square' key={index} />
          })
        }
      </div>
    </div>
    <div css={css`
        margin-top: 12px;
        color: #444;

        p, ul, ol {
          margin-bottom: 12px;
          &:last-child {
            margin-bottom: 0;
          }
        }

        h1, h2, h3, h4, h5, h6, strong {
          font-weight: bold;
          color: #222;
        }
      `}
      dangerouslySetInnerHTML={{
        __html: marked(book.description, {
          gfm: true,
          breaks: true,
          sanitize: true
        })
      }} />
  </div>
}

export default BookCell
