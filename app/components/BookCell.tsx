/** @jsx jsx */
import Link from 'next/link'

import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import marked from 'marked'

import Book, { types, mediums } from '../utils/book'
import { colors } from '../utils/style'
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
} from 'sancho'
import { media } from '../utils/style'
import Contents from './Contents'

import check from '../images/check.svg'
import EventContext from '../contexts/EventContext'
import CheckCount from './CheckCount'
import StarsContext from '../contexts/StarsContext'
import { db } from '../utils/firebase'
import CircleCell, { CircleBooth } from './CircleCell'
import SnsShare, { SnsShareSize } from './SnsShare'
import { imageUrl } from '../utils/imageUrl'

// TODO(mottox2): 頒布物一覧とサークル内のBookCellは分割したい
interface Props {
  book: Book
  editable?: boolean
  isShowCircle?: boolean
  isShowSnsShare?: boolean
  isLast?: boolean
  isFirst?: boolean
  movePrev?: (e: Event) => void
  moveNext?: (e: Event) => void
}

interface StarCount {
  count: number
}

const width = 252

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

const useCheckSubmission = (isOwner: boolean, bookId: string) => {
  const [submission, setSubmission] = useState()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!isOwner) return
    const submissionQuery = db.collection('bookSubmissions').doc(bookId)
    submissionQuery.get().then(res => {
      setLoading(false)
      if (res.exists) setSubmission(res.data())
    })
  }, [bookId])
  return !loading && !submission
}

const BookCell: React.SFC<Props> = ({
  book,
  editable = false,
  isShowCircle = false,
  isShowSnsShare = false,
  moveNext,
  movePrev,
  isLast = true,
  isFirst = true
}) => {
  // FIXME(mottox2): 状態管理ライブラリを入れるべき。やっぱりpropsリレーしんどい
  const { user, openLoginModal } = useContext(UserContext)
  const { userStars, addStar, removeStar } = useContext(StarsContext)
  const { eventId } = useContext(EventContext)
  const notSubmitted = useCheckSubmission(editable, book.id!)
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
      const query = db.collection('starCounts').doc(`books-${book.id}`)
      query.get().then(res => {
        const count = res.exists ? (res.data() as StarCount).count : 0
        console.log(book.id, count)
        setStarCount(count)
      })
    }
  }, [])

  return (
    <>
      {isShowCircle && (
        <a
          target="_blank"
          href={`/${eventId}/circles/${circleId}`}
          css={css`
            margin-top: 24px;
            display: block;
            text-decoration: none;
            border-top-right-radius: 4px;
            color: inherit;
            svg {
              margin-left: 4px;
            }
            &:hover {
              background-color: #eee;
            }
          `}
        >
          <CircleBooth name={book.circle!.name}>
            {book.circle!.booth}
          </CircleBooth>
        </a>
      )}
      <Container ref={docRef}>
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
            <Link href='/[eventId]/books/[id]' as={`/${eventId}/books/${book.id}`} key={book.id} passHref>
              <BookLink>
                <BookTitle>{book.title}</BookTitle>
              </BookLink>
            </Link>
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
              isChecked={(book.id && userStars[eventId].bookStars.includes(book.id)) || false}
              onClick={() => {
                if (!user) {
                  return openLoginModal()
                }
                if (!book.id) return
                if (userStars[eventId].bookStars.includes(book.id)) {
                  removeStar(eventId, 'books', book.id)
                  toast({
                    title: `「${book.title}」のチェックを外しました`,
                    intent: 'success'
                  })
                } else {
                  addStar(eventId, 'books', book.id)
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
            {book.type == 'fanzine' && <div css={css`position: relative;`}>
              <Link href='/[eventId]/books/[id]/submit' as={`/${eventId}/books/${book.id}/submit`} passHref>
                <a css={css(button)}>見本誌の提出</a>
              </Link>
              {notSubmitted && <span css={css`
                position: absolute;
                top: -12px;
                background-color: red;
                border-radius: 20px;
                font-size: 12px;
                padding: 2px 10px;
                right: -6px;
                color: white;
                font-weight: bold;
              `}>要提出</span>}
            </div>}
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

        {isShowSnsShare && (
          <div
            css={css`
                margin-top: 12px;
                margin-bottom: 12px;
              `}
          >
            <SnsShare size={SnsShareSize.Large} />
          </div>
        )}

        {images.length > 0 && (
          <div css={css` margin: 20px -20px 0; `}>
            <ImagesContainer>
              {images.map((image, index) => {
                return (
                  <ImageBox
                    imageUrl={imageUrl(image, { height: 712 })}
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
    </>
  )
}

export default BookCell

const Container = styled.div`
  background-color: white;
  margin-bottom: 20px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  border-top-left-radius: 0;
`

const ImagesContainer = styled.div`
  white-space: nowrap;
  overflow-x: auto;
  padding: 0 20px;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
`
const BookLink = styled.a`
  text-decoration: none;
  display: inline-block;
  width: 100%;
  margin-bottom: 4px;
  color: inherit;
  &:hover h2 {
    color: ${colors.primary};
  }
`

const BookTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
`
