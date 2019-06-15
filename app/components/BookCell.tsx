/** @jsx jsx */
import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/firestore'

import { jsx, css, Global } from '@emotion/core'
import marked from 'marked'

import Book, { types, mediums } from '../utils/book'
import ImageBox from '../components/ImageBox'
import Label from '../components/Label'
import CheckButton from '../components/CheckButton'
import Lightbox from 'react-image-lightbox'
import { useState, useMemo, useContext, useEffect } from 'react'
import UserContext from '../contexts/UserContext'
import { useToast } from 'sancho'
import { media } from '../utils/style'

import check from '../images/check.svg'

// TODO(mottox2): 頒布物一覧とサークル内のBookCellは分割したい
interface Props {
  book: Book
  editable?: boolean
  isShowCircle?: boolean
  isLast?: boolean
  isFirst?: boolean
  movePrev?: Function
  moveNext?: Function
}

interface StarCount {
  count: number
}

const BookCell: React.SFC<Props> = ({
  book,
  editable = false,
  isShowCircle = false,
  moveNext,
  movePrev,
  isLast = true,
  isFirst = true
}) => {
  // FIXME(mottox2): 状態管理ライブラリを入れるべき。やっぱりpropsリレーしんどい
  const { user, addBookStar, removeBookStar, bookStars } = useContext(UserContext)
  const toast = useToast()

  const metadata = [
    book.type && `${types[book.type]}`,
    book.pages > 0 && `${book.pages}ページ`,
    book.stock > 0 && `${book.stock}部頒布`,
    book.medium && `${mediums[book.medium]}`,
    book.price > 0 && `${String(book.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}円`
  ].filter(el => el)
  // できれば分けたい
  const [isOpenLightbox, updateOpenLightBox] = useState(false)
  const [lightBoxIndex, updateLightboxIndex] = useState(0)
  const [starCount, setStarCount] = useState(0)
  const { images } = book
  const descriptionHTML = useMemo(() => {
    return marked(book.description, {
      gfm: true,
      breaks: true,
      sanitize: true
    })
  }, [book.description])

  // FIXME:
  const circleId =
    typeof book.circleRef === 'string' ? book.circleRef : book.circleRef._path.segments[1]

  useEffect(() => {
    if (editable) {
      const db = firebase.firestore()
      db.collection('starCounts')
        .doc(`books-${book.id}`)
        .get()
        .then(res => {
          const count = res.exists ? (res.data() as StarCount).count : 0
          console.log(book.id, count)
          setStarCount(count)
        })
    }
  }, [])

  return (
    <div
      css={css`
        background-color: white;
        margin-bottom: 20px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        border-radius: 8px;
      `}
      key={book.id}
    >
      {isShowCircle && (
        <Link href={`/circles/_id?id=${circleId}`} as={`/circles/${circleId}`} passHref>
          <a>{book.circleName}</a>
        </Link>
      )}
      <div
        css={css`
          display: flex;
          align-items: center;

          @media ${media.small} {
            flex-direction: column;
            align-items: initial;
          }
        `}
      >
        <div
          css={css`
            @media ${media.small} {
              margin-bottom: 12px;
            }
          `}
        >
          <div
            css={css`
              font-size: 20px;
              font-weight: bold;
            `}
          >
            {book.title}
          </div>
          <div
            css={css`
              font-size: 13px;
              margin-top: 2px;
            `}
          >
            {book.isNew && <Label backgroundColor={'#ECB40D'} color={'white'} text="新刊" />}
            <span
              css={css`
                opacity: 0.8;
              `}
            >
              {metadata.join('・')}
            </span>
          </div>
        </div>

        {editable ? (
          <div
            css={css`
              margin-left: auto;
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

            <Link href={`/books/edit?id=${book.id}`} as={`/books/${book.id}/edit`} passHref>
              <a
                css={css`
                  border: 1px solid #2a5773;
                  text-decoration: none;
                  padding: 6px 20px;
                  border-radius: 4px;
                  font-size: 15px;
                  font-weight: 600;
                  color: #2a5773;
                  transition: all 0.2s ease;
                  white-space: nowrap;
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
            isChecked={(book.id && bookStars.includes(book.id)) || false}
            onClick={() => {
              if (!user) {
                return toast({
                  title: `この機能を利用するにはログインしてください。`,
                  intent: 'danger'
                })
              }
              if (!book.id) {
                return
              }
              if (bookStars.includes(book.id)) {
                console.log('remove book start')
                removeBookStar(book.id)
                toast({
                  title: `「${book.title}」のチェックを外しました`,
                  intent: 'success'
                })
              } else {
                console.log('create book start')
                addBookStar(book.id)
                toast({
                  title: `「${book.title}」をチェックしました`,
                  intent: 'success'
                })
              }
            }}
          />
        )}
      </div>
      {images.length > 0 && (
        <div
          css={css`
            margin: 20px -20px 0;
          `}
        >
          <div
            css={css`
              white-space: nowrap;
              overflow-x: auto;
              padding: 0 20px;
            `}
          >
            {images.map((image, index) => {
              return (
                <ImageBox
                  imageUrl={image}
                  size="square"
                  onClick={() => {
                    updateOpenLightBox(true)
                    updateLightboxIndex(index)
                  }}
                  width={180}
                  key={index}
                />
              )
            })}
          </div>
        </div>
      )}
      {descriptionHTML.length > 0 && (
        <div
          css={css`
            margin-top: 12px;
            color: #444;

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
          `}
          dangerouslySetInnerHTML={{
            __html: descriptionHTML
          }}
        />
      )}

      {!isFirst && movePrev && <div onClick={movePrev}>Prev</div>}
      {!isLast && moveNext && <div onClick={moveNext}>Next</div>}
      {isOpenLightbox && (
        <>
          <Global
            styles={css`
              @keyframes closeWindow {
                0% {
                  opacity: 1;
                }
                100% {
                  opacity: 0;
                }
              }

              .ril__outer {
                background-color: rgba(0, 0, 0, 0.85);
                outline: none;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1000;
                width: 100%;
                height: 100%;
                -ms-content-zooming: none;
                -ms-user-select: none;
                -ms-touch-select: none;
                touch-action: none;
              }

              .ril__outerClosing {
                opacity: 0;
              }

              .ril__inner {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
              }

              .ril__image,
              .ril__imagePrev,
              .ril__imageNext {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
                max-width: none;
                -ms-content-zooming: none;
                -ms-user-select: none;
                -ms-touch-select: none;
                touch-action: none;
              }

              .ril__imageDiscourager {
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;
              }

              .ril__navButtons {
                border: none;
                position: absolute;
                top: 0;
                bottom: 0;
                width: 20px;
                height: 34px;
                padding: 40px 30px;
                margin: auto;
                cursor: pointer;
                opacity: 0.7;
              }
              .ril__navButtons:hover {
                opacity: 1;
              }
              .ril__navButtons:active {
                opacity: 0.7;
              }

              .ril__navButtonPrev {
                left: 0;
                background: rgba(0, 0, 0, 0.2)
                  url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjM0Ij48cGF0aCBkPSJtIDE5LDMgLTIsLTIgLTE2LDE2IDE2LDE2IDEsLTEgLTE1LC0xNSAxNSwtMTUgeiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg==')
                  no-repeat center;
              }

              .ril__navButtonNext {
                right: 0;
                background: rgba(0, 0, 0, 0.2)
                  url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjM0Ij48cGF0aCBkPSJtIDEsMyAyLC0yIDE2LDE2IC0xNiwxNiAtMSwtMSAxNSwtMTUgLTE1LC0xNSB6IiBmaWxsPSIjRkZGIi8+PC9zdmc+')
                  no-repeat center;
              }

              .ril__downloadBlocker {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
                background-size: cover;
              }

              .ril__caption,
              .ril__toolbar {
                background-color: rgba(0, 0, 0, 0.5);
                position: absolute;
                left: 0;
                right: 0;
                display: flex;
                justify-content: space-between;
              }

              .ril__caption {
                bottom: 0;
                max-height: 150px;
                overflow: auto;
              }

              .ril__captionContent {
                padding: 10px 20px;
                color: #fff;
              }

              .ril__toolbar {
                top: 0;
                height: 50px;
              }

              .ril__toolbarSide {
                height: 50px;
                margin: 0;
              }

              .ril__toolbarLeftSide {
                padding-left: 20px;
                padding-right: 0;
                flex: 0 1 auto;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .ril__toolbarRightSide {
                padding-left: 0;
                padding-right: 20px;
                flex: 0 0 auto;
              }

              .ril__toolbarItem {
                display: inline-block;
                line-height: 50px;
                padding: 0;
                color: #fff;
                font-size: 120%;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .ril__toolbarItemChild {
                vertical-align: middle;
              }

              .ril__builtinButton {
                width: 40px;
                height: 35px;
                cursor: pointer;
                border: none;
                opacity: 0.7;
              }
              .ril__builtinButton:hover {
                opacity: 1;
              }
              .ril__builtinButton:active {
                outline: none;
              }

              .ril__builtinButtonDisabled {
                cursor: default;
                opacity: 0.5;
              }
              .ril__builtinButtonDisabled:hover {
                opacity: 0.5;
              }

              .ril__closeButton {
                background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIj48cGF0aCBkPSJtIDEsMyAxLjI1LC0xLjI1IDcuNSw3LjUgNy41LC03LjUgMS4yNSwxLjI1IC03LjUsNy41IDcuNSw3LjUgLTEuMjUsMS4yNSAtNy41LC03LjUgLTcuNSw3LjUgLTEuMjUsLTEuMjUgNy41LC03LjUgLTcuNSwtNy41IHoiIGZpbGw9IiNGRkYiLz48L3N2Zz4=')
                  no-repeat center;
              }

              .ril__zoomInButton {
                background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGcgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PHBhdGggZD0iTTEgMTlsNi02Ii8+PHBhdGggZD0iTTkgOGg2Ii8+PHBhdGggZD0iTTEyIDV2NiIvPjwvZz48Y2lyY2xlIGN4PSIxMiIgY3k9IjgiIHI9IjciIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')
                  no-repeat center;
              }

              .ril__zoomOutButton {
                background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGcgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PHBhdGggZD0iTTEgMTlsNi02Ii8+PHBhdGggZD0iTTkgOGg2Ii8+PC9nPjxjaXJjbGUgY3g9IjEyIiBjeT0iOCIgcj0iNyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')
                  no-repeat center;
              }

              .ril__outerAnimating {
                animation-name: closeWindow;
              }

              @keyframes pointFade {
                0%,
                19.999%,
                100% {
                  opacity: 0;
                }
                20% {
                  opacity: 1;
                }
              }

              .ril__loadingCircle {
                width: 60px;
                height: 60px;
                position: relative;
              }

              .ril__loadingCirclePoint {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
              }
              .ril__loadingCirclePoint::before {
                content: '';
                display: block;
                margin: 0 auto;
                width: 11%;
                height: 30%;
                background-color: #fff;
                border-radius: 30%;
                animation: pointFade 200ms infinite ease-in-out both;
              }
              .ril__loadingCirclePoint:nth-of-type(1) {
                transform: rotate(0deg);
              }
              .ril__loadingCirclePoint:nth-of-type(7) {
                transform: rotate(180deg);
              }
              .ril__loadingCirclePoint:nth-of-type(1)::before,
              .ril__loadingCirclePoint:nth-of-type(7)::before {
                animation-delay: -800ms;
              }
              .ril__loadingCirclePoint:nth-of-type(2) {
                transform: rotate(30deg);
              }
              .ril__loadingCirclePoint:nth-of-type(8) {
                transform: rotate(210deg);
              }
              .ril__loadingCirclePoint:nth-of-type(2)::before,
              .ril__loadingCirclePoint:nth-of-type(8)::before {
                animation-delay: -666ms;
              }
              .ril__loadingCirclePoint:nth-of-type(3) {
                transform: rotate(60deg);
              }
              .ril__loadingCirclePoint:nth-of-type(9) {
                transform: rotate(240deg);
              }
              .ril__loadingCirclePoint:nth-of-type(3)::before,
              .ril__loadingCirclePoint:nth-of-type(9)::before {
                animation-delay: -533ms;
              }
              .ril__loadingCirclePoint:nth-of-type(4) {
                transform: rotate(90deg);
              }
              .ril__loadingCirclePoint:nth-of-type(10) {
                transform: rotate(270deg);
              }
              .ril__loadingCirclePoint:nth-of-type(4)::before,
              .ril__loadingCirclePoint:nth-of-type(10)::before {
                animation-delay: -400ms;
              }
              .ril__loadingCirclePoint:nth-of-type(5) {
                transform: rotate(120deg);
              }
              .ril__loadingCirclePoint:nth-of-type(11) {
                transform: rotate(300deg);
              }
              .ril__loadingCirclePoint:nth-of-type(5)::before,
              .ril__loadingCirclePoint:nth-of-type(11)::before {
                animation-delay: -266ms;
              }
              .ril__loadingCirclePoint:nth-of-type(6) {
                transform: rotate(150deg);
              }
              .ril__loadingCirclePoint:nth-of-type(12) {
                transform: rotate(330deg);
              }
              .ril__loadingCirclePoint:nth-of-type(6)::before,
              .ril__loadingCirclePoint:nth-of-type(12)::before {
                animation-delay: -133ms;
              }
              .ril__loadingCirclePoint:nth-of-type(7) {
                transform: rotate(180deg);
              }
              .ril__loadingCirclePoint:nth-of-type(13) {
                transform: rotate(360deg);
              }
              .ril__loadingCirclePoint:nth-of-type(7)::before,
              .ril__loadingCirclePoint:nth-of-type(13)::before {
                animation-delay: 0ms;
              }

              .ril__loadingContainer {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
              }
              .ril__imagePrev .ril__loadingContainer,
              .ril__imageNext .ril__loadingContainer {
                display: none;
              }

              .ril__errorContainer {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
              }
              .ril__imagePrev .ril__errorContainer,
              .ril__imageNext .ril__errorContainer {
                display: none;
              }

              .ril__loadingContainer__icon {
                color: #fff;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
              }
            `}
          />
          <Lightbox
            animationDuration={100}
            mainSrc={images[lightBoxIndex]}
            nextSrc={images[(lightBoxIndex + 1) % images.length]}
            prevSrc={images[(lightBoxIndex + images.length - 1) % images.length]}
            onCloseRequest={() => updateOpenLightBox(false)}
            onMovePrevRequest={() =>
              updateLightboxIndex((lightBoxIndex + images.length - 1) % images.length)
            }
            onMoveNextRequest={() => updateLightboxIndex((lightBoxIndex + +1) % images.length)}
          />
        </>
      )}
    </div>
  )
}

export default BookCell
