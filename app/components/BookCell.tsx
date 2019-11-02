/** @jsx jsx */
import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/firestore'

import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import marked from 'marked'

import Book, { types, mediums } from '../utils/book'
import ImageBox from '../components/ImageBox'
import Label from '../components/Label'
import CheckButton from '../components/CheckButton'
import Lightbox from 'react-image-lightbox'
import { useState, useMemo, useContext, useEffect, useRef } from 'react'
import UserContext from '../contexts/UserContext'
import {
  useToast,
  ResponsivePopover,
  MenuList,
  MenuItem,
  IconButton,
  IconMoreVertical,
  IconArrowUp,
  IconArrowDown,
  Divider,
  Button,
  IconChevronRight
} from 'sancho'
import { media } from '../utils/style'
import Contents from './Contents'

import check from '../images/check.svg'
import EventContext from '../contexts/EventContext'
import CheckCount from './CheckCount'

// TODO(mottox2): 頒布物一覧とサークル内のBookCellは分割したい
interface Props {
  book: Book
  editable?: boolean
  isShowCircle?: boolean
  isLast?: boolean
  isFirst?: boolean
  movePrev?: (e: Event) => void
  moveNext?: (e: Event) => void
}

interface StarCount {
  count: number
}

const flexChildLink = css`
  flex: 1;
`

const button = css`
  border: 1px solid #2a5773;
  text-decoration: none;
  padding: 8px 20px;
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
`

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
  const { user, addBookStar, removeBookStar, bookStars, openLoginModal } = useContext(UserContext)
  const { eventId } = useContext(EventContext)
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
  // 順番を並び替えたときにPopoverを閉じるために利用するRef
  const docRef = useRef<HTMLDivElement>(null)

  const circleId = book.circle!.id

  useEffect(() => {
    if (editable) {
      const db: firebase.firestore.Firestore = firebase.firestore()
      const query = db.collection('starCounts').doc(`books-${book.id}`)
      query.get().then(res => {
        const count = res.exists ? (res.data() as StarCount).count : 0
        console.log(book.id, count)
        setStarCount(count)
      })
    }
  }, [])

  return (
    <Container ref={docRef}>
      {isShowCircle && (
        <a
          target="_blank"
          href={`/${eventId}/circles/${circleId}`}
          css={css`
            align-items: center;
            text-decoration: none;
            font-weight: bold;
            padding: 4px 8px;
            margin: 0 -8px;
            display: inline-flex;
            border-radius: 4px;
            color: inherit;
            svg {
              margin-left: 4px;
            }
            &:hover {
              background-color: #eee;
            }
          `}
        >
          <div
            css={css`
              display: inline-block;
              background-color: #2a5773;
              color: white;
              padding: 2px 8px;
              border-radius: 2px;
              margin-right: 6px;
            `}
          >
            {book.circle!.booth}
          </div>{' '}
          {book.circle!.name}
          <IconChevronRight />
        </a>
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
          <BookTitle>{book.title}</BookTitle>
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

        {editable ? <CheckCount count={starCount} /> : (
          <CheckButton
            isChecked={(book.id && bookStars.includes(book.id)) || false}
            onClick={() => {
              if (!user) {
                return openLoginModal()
              }
              if (!book.id) return
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
      {editable && (
        <div
          css={css`
            margin-top: 12px;
            margin-bottom: 12px;
            margin-left: auto;
            display: flex;
            > * {
              margin-left: 6px;
            }
            > *:first-child {
              margin-left: auto;
            }
          `}
        >
          {eventId === 'gishohaku1' && book.type == 'fanzine' && (
            <Link href='/[eventId]/books/[id]/submit' as={`/${eventId}/books/${book.id}/submit`} passHref>
              <a css={css(button)}>見本誌の提出</a>
            </Link>
          )}
          <Link href='/[eventId]/books/[id]/edit' as={`/${eventId}/books/${book.id}/edit`} passHref>
            <a css={button}>編集</a>
          </Link>
          {(!isFirst || !isLast) && (
            <ResponsivePopover
              placement="bottom-end"
              content={
                // @ts-ignore
                <MenuList>
                  {!isFirst && movePrev && (
                    <MenuItem
                      contentBefore={<IconArrowUp />}
                      onPress={e => {
                        docRef.current && docRef.current.click()
                        movePrev(e as any)
                      }}
                    >
                      上に移動
                    </MenuItem>
                  )}
                  {!isLast && moveNext && (
                    <MenuItem
                      contentBefore={<IconArrowDown />}
                      onPress={e => {
                        docRef.current && docRef.current.click()
                        moveNext(e as any)
                      }}
                    >
                      下に移動
                    </MenuItem>
                  )}
                </MenuList>
              }
            >
              <IconButton variant="outline" icon={<IconMoreVertical />} label="Show more" />
            </ResponsivePopover>
          )}
        </div>
      )}
      {images.length > 0 && (
        <div css={css` margin: 20px -20px 0; `}>
          <ImagesContainer>
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
          </ImagesContainer>
        </div>
      )}
      {descriptionHTML.length > 0 && (
        <Contents dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
      )}
      {(book.sampleUrl || book.purchaseUrl) && <Divider />}
      <div css={css`display: flex;`}>
        {book.sampleUrl && (
          <Button
            component="a"
            href={book.sampleUrl}
            target="_blank"
            rel="noopner"
            variant={'ghost'}
            css={flexChildLink}
          >
            立ち読み
          </Button>
        )}
        {book.purchaseUrl && (
          <Button
            component="a"
            href={book.purchaseUrl}
            target="_blank"
            rel="noopner"
            css={flexChildLink}
          >
            電子版を購入
          </Button>
        )}
      </div>

      {isOpenLightbox && (
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
      )}
    </Container>
  )
}

export default BookCell

const Container = styled.div`
  background-color: white;
  margin-bottom: 20px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
`

const ImagesContainer = styled.div`
  white-space: nowrap;
  overflow-x: auto;
  padding: 0 20px;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
`

const BookTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
`
