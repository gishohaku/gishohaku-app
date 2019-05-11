/** @jsx jsx */
import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

import { jsx, css, Global } from '@emotion/core'
import marked from 'marked'

import circleTumbnail from '../images/circle.png'
import editIcon from '../images/edit.svg'

import { Button } from 'sancho'
import { withRouter } from 'next/router'
import { refToPath } from '../utils/firebase'
import Circle, { categories } from '../utils/circle'
import Book, { types, mediums } from '../utils/book'
import { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext';
import Loader from '../components/Loader';
import { media } from '../utils/style'
import ImageBox from '../components/ImageBox';

const Label: React.FC<{
  text: string
  color?: string
  backgroundColor?: string
}> = ({ text, color, backgroundColor }) => {

  return <p css={css`
    font-size: 12px ;
    padding: 4px 8px;
    line-height: 1.2;
    display: inline-block;
    background-color: ${backgroundColor || '#e1e5ec'};
    border-radius: 2px;
    margin-right: 4px;
    color: ${color || 'rgba(0, 0, 0, 0.6)'};
    font-weight: bold;
  `}>{text}</p>
}

const Mypage = (props: any) => {
  const { user, isUserLoading, userData } = useContext(UserContext)
  const [books, setBooks] = useState<Book[]>([])
  const [circle, setCircle] = useState<Circle>()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (!user || !userData || !userData.circleRef) {
      setLoading(false)
      console.log('Not circle member', user, userData)
      return () => { }
    }
    const db = firebase.firestore()
      ; (async () => {
        const circleRef = userData.circleRef!
        const circleSnapShot = await circleRef.get()
        setCircle({ id: circleSnapShot.id, ...circleSnapShot.data() as Circle })
        const snapshots = await db.collection('books').where("circleRef", "==", circleRef).get()
        let bookResults: Book[] = []
        snapshots.forEach(book => {
          const data = book.data()
          bookResults.push({
            id: book.id,
            ...refToPath(data, 'circleRef') as Book
          })
        })
        setBooks(bookResults)
        setLoading(false)
      })()
  }, [userData])

  console.log(isLoading, isUserLoading, books)

  if (userData && !userData.circleRef) {
    return <p>サークルメンバー用のページです</p>
  }


  if (isLoading || isUserLoading) {
    return <Loader label="Loading..." />
  }

  if (!user) {
    return <>
      <p>ログインしてください</p>
      <Button onClick={() => {
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider).then(function (result) {
          console.log(result)
        })
      }}>
        Login
      </Button>
    </>
  }
  return (
    <>
      <Global styles={{
        body: {
          backgroundColor: "#F7F8FA"
        }
      }} />
      <div css={css`
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
      `}>
        <div css={css`
          width: 258px;
          margin-right: 48px;
          @media ${media.medium} {
            margin: 0 0 24px;
          }
        `}>
          {circle &&
            <>
              {/* <img src={circleTumbnail} css={css`
                margin-bottom: 8px;
              `} /> */}
              <ImageBox width={258} size='circlecut' imageUrl={circle.image || circleTumbnail} />
              {/* TODO: サークル名, firestoreのルールで編集不可にする */}
              <div css={css`
                margin-top: 8px;
              `}>
                <Label backgroundColor={'#2A5773'} color={'white'} text='あ01' />
                <Label text={categories[circle.category]} />
              </div>
              <h2 css={css`
                font-size: 20px;
                font-weight: bold;
                margin-top: 2px;
              `}>
                {circle.name}
              </h2>
              {/* <a css={css`
                font-size: 12px;
              `} href={circle.website}>
                {circle.website}
              </a> */}
              <div>
                <Link href={`/circles/edit?id=${circle.id}`} as={`/circles/${circle.id}/edit`}>
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

                      display: inline-block;
                      margin-top: 8px;
                      cursor: pointer;

                      &:hover {
                        background-color: #2A5773;
                        color: white;
                      }
                  `}>
                    編集
                  </a>
                </Link>
              </div>
            </>
          }
        </div>
        <div css={css`
          flex: 1;
          width: 100%;
        `}>
          {
            books.map(book => {
              const metadata = [
                book.type && `${types[book.type]}`,
                book.pages > 0 && `${book.pages}ページ`,
                book.stock > 0 && `${book.stock}部頒布予定`,
                book.medium && `${mediums[book.medium]}`,
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
                        opacity: 0.6;
                      `}>
                        {metadata.join("・")}
                      </span>
                    </div>
                  </div>
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
                  opacity: 0.8;
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
            })
          }
          <Link href='/books/new'>
            <a css={css`
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
              transition: box-shadow .15s ease-out;
              &:hover {
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
              }
              img {
                margin-right: 4px;
                opacity: 0.6;
              }
          `}>
              <img src={editIcon} />
              頒布物を追加
          </a></Link>
        </div>
      </div>
    </>
  )
}

export default withRouter(Mypage)
