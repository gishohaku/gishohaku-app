/** @jsx jsx */
import Link from 'next/link'

import produce from 'immer'

import { jsx, css } from '@emotion/react'
import styled from '@emotion/styled'
import circleTumbnail from '../images/circle.png'
import editIcon from '../images/edit.svg'

import Book from '../utils/book'
import Circle, { allCategories } from '../utils/circle'
import BookCell from '../components/BookCell'
import CheckButton from './CheckButton'
import { colors, media } from '../utils/style'
import ImageBox from '../components/ImageBox'
import Label from '../components/Label'
import { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext'

import EventContext from '../contexts/EventContext'
import CheckCount from './CheckCount'
import SnsShare, { SnsShareSize } from './SnsShare'
import StarsContext from '../contexts/StarsContext'
import { db } from '../utils/firebase'
import { imageUrl } from '../utils/imageUrl'
import { useToast } from './Toast'

interface Props {
  circle: Circle
  books: Book[]
  editable?: boolean
  isShowSnsShare?: boolean
  setBooks?: (books: Book[]) => void
}

interface StarCount {
  count: number
}

const CircleDetail: React.FC<Props> = ({
  circle,
  books,
  editable,
  isShowSnsShare = false,
  setBooks,
}) => {
  const { user, openLoginModal } = useContext(UserContext)
  const { userStars, addStar, removeStar } = useContext(StarsContext)
  const toast = useToast()
  const { eventId } = useContext(EventContext)
  const [starCount, setStarCount] = useState(0)

  useEffect(() => {
    if (editable) {
      const query = db.collection('starCounts').doc(`circles-${circle.id}`)
      query.get().then((res) => {
        const count = res.exists ? (res.data() as StarCount).count : 0
        console.log(circle.id, count)
        setStarCount(count)
      })
    }
  }, [])

  const circleColor: string = '#3FBD92'

  if (!circle) return null

  return (
    <Container>
      <div
        css={css`
          width: 258px;
          margin-right: 48px;
          @media ${media.medium} {
            margin: 0 0 24px;
          }
        `}>
        <ImageBox
          width={258}
          size="circlecut"
          imageUrl={
            imageUrl(circle.image, {
              width: 504,
              height: 710,
              aspect: 'crop',
            }) || circleTumbnail
          }
        />
        <div style={{ marginTop: 8 }}>
          {circle.booth && (
            <Label
              backgroundColor={circleColor}
              color={'white'}
              text={circle.booth}
            />
          )}
          <Label text={allCategories[circle.category]} />
        </div>
        <CircleName>{circle.name}</CircleName>
        <p className="text-sm mb-4 text-gray-600">{circle.description}</p>
        {editable ? (
          <div style={{ display: 'flex' }}>
            <CheckCount count={starCount} />
            <Link href={`/${eventId}/circles/${circle.id}/edit`}
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
                margin-left: 8px;

                &:hover {
                  background-color: #2a5773;
                  color: white;
                }
              `}>
              編集
            </Link>
          </div>
        ) : (
          <CheckButton
            isChecked={
              (circle.id &&
                userStars[eventId].circleStars.includes(circle.id)) ||
              false
            }
            onClick={() => {
              if (!user) {
                return openLoginModal()
              }
              if (!circle.id) {
                return
              }
              if (userStars[eventId].circleStars.includes(circle.id)) {
                removeStar(eventId, 'circles', circle.id)
                toast({ title: `サークルのチェックを外しました` })
              } else {
                addStar(eventId, 'circles', circle.id)
                toast({ title: `サークルをチェックしました` })
              }
            }}
          />
        )}

        {isShowSnsShare && (
          <div
            css={css`
              margin-top: 12px;
              margin-bottom: 12px;
            `}>
            <SnsShare size={SnsShareSize.Small} />
          </div>
        )}
      </div>
      <BooksContainer>
        {books.map((book, index) => (
          <BookCell
            book={book}
            editable={editable}
            key={book.id}
            isLast={index === books.length - 1}
            isFirst={index === 0}
            movePrev={() => {
              const newBooks = produce(books, (drafts) => {
                drafts[index] = books[index - 1]
                drafts[index - 1] = books[index]
              })
              console.log(newBooks)
              setBooks && setBooks(newBooks)
              newBooks
                .map((b) => b.id)
                .forEach((bookId, order) => {
                  db.collection('books').doc(bookId).update({ order })
                })
              toast({
                title: `頒布物を並び替えました`,
                intent: 'success',
              })
            }}
            moveNext={() => {
              const newBooks = produce(books, (drafts) => {
                drafts[index] = books[index + 1]
                drafts[index + 1] = books[index]
              })
              console.log(newBooks)
              setBooks && setBooks(newBooks)
              newBooks
                .map((b) => b.id)
                .forEach((bookId, order) => {
                  db.collection('books').doc(bookId).update({ order })
                })
              toast({
                title: `頒布物を並び替えました`,
                intent: 'success',
              })
            }}
          />
        ))}
        {books.length === 0 && <BlankMessage circleName={circle.name} />}
        {editable && (
          <Link href={`/${eventId}/books/new`} legacyBehavior passHref>
            <NewBookButton>
              <img src={editIcon} />
              頒布物を追加
            </NewBookButton>
          </Link>
        )}
      </BooksContainer>
    </Container>
  )
}

const BlankMessage: React.FC<{
  circleName: string
}> = ({ circleName }) => (
  <div
    css={css`
      padding: 0 16px;
    `}>
    <img
      css={css`
        max-width: 100%;
        width: 400px;
        display: block;
        margin: 0 auto;
      `}
      src="/static/blank.png"
    />
    <h2
      css={css`
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        margin-bottom: 8px;
      `}>
      頒布物が登録されていません
    </h2>
    <p
      css={css`
        text-align: center;
      `}>
      「{circleName}」には頒布物が登録されていないようです。
      <br />
      読みたい本がありそうなら筆者に気持ちを伝えてみましょう。
    </p>
  </div>
)

export default CircleDetail

const Container = styled.div`
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
`

const BooksContainer = styled.div`
  flex: 1;
  width: calc(100% - 250px - 32px - 48px);
  @media ${media.medium} {
    width: 100%;
  }
`

const NewBookButton = styled.a`
  display: block;
  background-color: white;
  margin-bottom: 24px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  color: #444;
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
`

const CircleName = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-top: 2px;
`
