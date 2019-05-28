/** @jsx jsx */
import Link from 'next/link'

import { jsx, css } from '@emotion/core'

import circleTumbnail from '../images/circle.png'
import editIcon from '../images/edit.svg'

import Book from '../utils/book'
import Circle, { categories } from '../utils/circle'
import BookCell from '../components/BookCell'
import CheckButton from './CheckButton'
import { media } from '../utils/style'
import ImageBox from '../components/ImageBox'
import Label from '../components/Label'
import { useContext } from 'react'
import UserContext from '../contexts/UserContext'
import { useToast } from 'sancho'

interface Props {
  circle: Circle
  books: Book[]
  editable?: boolean
}

const CircleDetail: React.FC<Props> = ({ circle, books, editable }) => {
  const { circleStars, addCircleStar, removeCircleStar } = useContext(UserContext)
  const toast = useToast()

  return (
    <>
      <div
        css={css`
          max-width: ${1080 + 32}px;
          padding: 0 16px;
          margin: 32px auto;
          display: flex;
          @media ${media.medium} {
            flex-direction: column;
            align-items: center;
          }
          @media ${media.small} {
            padding-left: 0;
            padding-right: 0;
          }
        `}
      >
        <div
          css={css`
            width: 258px;
            margin-right: 48px;
            @media ${media.medium} {
              margin: 0 0 24px;
            }
          `}
        >
          {circle && (
            <>
              <ImageBox width={258} size="circlecut" imageUrl={circle.image || circleTumbnail} />
              <div
                css={css`
                  margin-top: 8px;
                `}
              >
                {circle.space && (
                  <Label backgroundColor={'#2A5773'} color={'white'} text={circle.space} />
                )}
                <Label text={categories[circle.category]} />
              </div>
              <h2
                css={css`
                  font-size: 20px;
                  font-weight: bold;
                  margin-top: 2px;
                `}
              >
                {circle.name}
              </h2>
              <CheckButton
                isChecked={(circle.id && circleStars.includes(circle.id)) || false}
                onClick={() => {
                  if (!circle.id) {
                    return
                  }
                  if (circleStars.includes(circle.id)) {
                    removeCircleStar(circle.id)
                    toast({
                      title: `サークルのチェックを外しました`,
                      intent: 'success'
                    })
                  } else {
                    addCircleStar(circle.id)
                    toast({
                      title: `サークルをチェックしました`,
                      intent: 'success'
                    })
                  }
                }}
              />
              {/* <a css={css`
                font-size: 12px;
              `} href={circle.website}>
                {circle.website}
              </a> */}
              {editable && (
                <div>
                  <Link href={`/circles/edit?id=${circle.id}`} as={`/circles/${circle.id}/edit`}>
                    <a
                      css={css`
                        margin-left: auto;
                        border: 1px solid #2a5773;
                        text-decoration: none;
                        padding: 6px 20px;
                        border-radius: 4px;
                        font-size: 15px;
                        font-weight: 600;
                        color: #2a5773;
                        transition: all 0.2s ease;
                        white-space: nowrap;

                        display: inline-block;
                        margin-top: 8px;
                        cursor: pointer;

                        &:hover {
                          background-color: #2a5773;
                          color: white;
                        }
                      `}
                    >
                      編集
                    </a>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
        <div
          css={css`
            flex: 1;
            width: calc(100% - 250px - 32px - 48px);
            @media ${media.medium} {
              width: 100%;
            }
          `}
        >
          {books.map(book => (
            <BookCell book={book} editable={editable} key={book.id} />
          ))}
          {editable && (
            <Link href="/books/new">
              <a
                css={css`
                  display: block;
                  background-color: white;
                  margin-bottom: 24px;
                  padding: 20px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
                  border-radius: 8px;
                  cursor: pointer;
                  text-align: center;
                  color: #444;
                  vertical-align: center;
                  display: flex;
                  justify-content: center;
                  transition: box-shadow 0.15s ease-out;
                  &:hover {
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
                  }
                  img {
                    margin-right: 4px;
                    opacity: 0.6;
                  }
                `}
              >
                <img src={editIcon} />
                頒布物を追加
              </a>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

export default CircleDetail
