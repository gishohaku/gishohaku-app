/** @jsx jsx */
import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/firestore'
import produce from 'immer'

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
import { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext'
import { useToast } from 'sancho'

import check from '../images/check.svg'
import EventContext from '../contexts/EventContext'

interface Props {
  circle: Circle
  books: Book[]
  editable?: boolean
  setBooks?: (books: Book[]) => void
}

interface StarCount {
  count: number
}

const CircleDetail: React.FC<Props> = ({ circle, books, editable, setBooks }) => {
  const { user, circleStars, addCircleStar, removeCircleStar, openLoginModal } = useContext(
    UserContext
  )
  const toast = useToast()
  const { eventId } = useContext(EventContext)
  const [starCount, setStarCount] = useState(0)

  useEffect(() => {
    if (editable) {
      const db: firebase.firestore.Firestore = firebase.firestore()
      const query = db.collection('starCounts').doc(`circles-${circle.id}`)
      query.get().then(res => {
        const count = res.exists ? (res.data() as StarCount).count : 0
        console.log(circle.id, count)
        setStarCount(count)
      })
    }
  }, [])

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
                {circle.booth && (
                  <Label backgroundColor={'#2A5773'} color={'white'} text={circle.booth} />
                )}
                <Label text={categories[circle.category]} />
              </div>
              <h2
                css={css`
                  font-size: 20px;
                  font-weight: bold;
                  margin-top: 2px;
                  margin-bottom: 8px;
                `}
              >
                {circle.name}
              </h2>
              {editable ? (
                <div
                  css={css`
                    display: flex;
                  `}
                >
                  <div
                    css={css`
                      border: 1px solid #eee;
                      background-color: #eee;
                      text-decoration: none;
                      padding: 6px 12px;
                      border-radius: 4px;
                      margin-right: 6px;
                      min-width: 72px;
                      text-align: center;
                      font-weight: bold;
                      display: flex;
                      justify-content: center;
                      > img {
                        margin-right: 4px;
                        opacity: 0.4;
                        width: 22px;
                      }
                    `}
                  >
                    <img src={check} />
                    <span>{starCount}</span>
                  </div>
                  <Link href={`/[eventId]/circles/[id]/edit`} as={`/${eventId}/circles/${circle.id}/edit`}>
                    <a
                      css={css`
                        flex: 1;
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
                        display: block;
                        cursor: pointer;
                        text-align: center;

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
              ) : (
                  <CheckButton
                    isChecked={(circle.id && circleStars.includes(circle.id)) || false}
                    onClick={() => {
                      if (!user) {
                        return openLoginModal()
                      }
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
          {books.map((book, index) => (
            <BookCell
              book={book}
              editable={editable}
              key={book.id}
              isLast={index === books.length - 1}
              isFirst={index === 0}
              movePrev={() => {
                const db = firebase.firestore()
                const newBooks = produce(books, drafts => {
                  drafts[index] = books[index - 1]
                  drafts[index - 1] = books[index]
                })
                console.log(newBooks)
                setBooks && setBooks(newBooks)
                const merge = true
                newBooks
                  .map(b => b.id)
                  .forEach((bookId, order) => {
                    db.collection('books')
                      .doc(bookId)
                      .set({ order }, { merge })
                  })
                toast({
                  title: `頒布物を並び替えました`,
                  intent: 'success'
                })
              }}
              moveNext={() => {
                const db = firebase.firestore()
                const newBooks = produce(books, drafts => {
                  drafts[index] = books[index + 1]
                  drafts[index + 1] = books[index]
                })
                console.log(newBooks)
                setBooks && setBooks(newBooks)
                const merge = true
                newBooks
                  .map(b => b.id)
                  .forEach((bookId, order) => {
                    db.collection('books')
                      .doc(bookId)
                      .set({ order }, { merge })
                  })
                toast({
                  title: `頒布物を並び替えました`,
                  intent: 'success'
                })
              }}
            />
          ))}
          {editable && (
            <Link href="/[eventId]/books/new" as={`/${eventId}/books/new`}>
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
