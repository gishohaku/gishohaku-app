/** @jsx jsx */
import Link from 'next/link'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

import { jsx, css, Global } from '@emotion/core'

import circleTumbnail from '../images/cirlceTumbnail.png'

import { Button } from 'sancho'
import Layout from '../components/Layout'
import { withRouter } from 'next/router'
import { refToPath, Book } from '../utils/firebase'
import Circle, { categories } from '../utils/circle'
import { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext';
import Loader from '../components/Loader';

const Label: React.FC<{
  text: string
  color?: string
  backgroundColor?: string
}> = ({ text, color, backgroundColor }) => {

  return <p css={css`
    font-size: 12px;
    padding: 4px 8px;
    line-height: 1.2;
    display: inline-block;
    background-color: ${backgroundColor || '#e1e5ec'};
    border-radius: 2px;
    margin-right: 4px;
    color: ${color || 'rgba(0, 0, 0, 0.8)'};
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
        setCircle({ id: circleSnapShot.id, ...circleSnapShot.data() })
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

  if (isLoading || isUserLoading) {
    return <Layout>
      <Loader label="Loading..." />
    </Layout>
  }

  if (!user) {
    return <Layout>
      <p>ログインしてください</p>
      <Button onClick={() => {
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider).then(function (result) {
          console.log(result)
        })
      }}>
        Login
      </Button>
    </Layout>
  }

  if (userData && !userData.circleRef) {
    return <Layout><p>サークルメンバー用のページです</p></Layout>
  }

  return (
    <Layout tab={props.router.query.tab}>
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
      `}>
        <div css={css`
          width: 258px;
          margin-right: 48px;
        `}>
          {circle &&
            <>
              <img src={circleTumbnail} css={css`
                margin-bottom: 8px;
              `} />
              {/* <p css={css`
                font-size: 12px;
                padding: 2px 8px;
                display: inline-block;
                background-color: #e1e5ec;
                border-radius: 2px;
                color: rgba(0, 0, 0, 0.6);
              `}>{categories[circle.category]}</p> */}
              <Label text={categories[circle.category]} />
              <h2 css={css`
                font-size: 20px;
                font-weight: bold;
                margin-top: 2px;
              `}>
                {circle.name}
              </h2>
              <a css={css`
                font-size: 12px;
              `} href={circle.website}>
                {circle.website}
              </a>
              <div>
                <Link href={`/circles/edit?id=${circle.id}`} as={`/circles/${circle.id}/edit`}>
                  <a>編集</a>
                </Link>
              </div>
            </>
          }
        </div>
        <div css={css`
          flex: 1;
        `}>
          {
            books.map(book => {
              const metadata = [
                book.type && `${book.type}`,
                book.pages > 0 && `${book.pages}ページ`,
                book.stock > 0 && `${book.stock}部頒布予定`,
                book.medium && `${book.medium}`,
              ].filter(el => el)
              return <div css={css`
                background-color: white;
                margin-bottom: 24px;
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
                      opacity: 0.6;
                    `}>
                      {book.isNew && <Label backgroundColor={'red'} color={'white'} text='新刊' />}
                      {metadata.join("・")}
                    </div>
                  </div>
                  <Link href={`/books/edit?id=${book.id}`} as={`/books/${book.id}/edit`} passHref>
                    <a css={css`
                      margin-left: auto;
                    `}>
                      Edit
                    </a>
                  </Link>
                </div>
                <div css={css`
                  opacity: 0.8;
                `}>
                  {/* TODO: HTMLをエスケープしつついい感じに改行を反映する */}
                  {book.description.split(/\r\n|\n/).map((paragraph, index) => {
                    return paragraph.length > 0 ? <p key={index}>{paragraph}</p> : <div key={index} css={css`
                    margin-top: 0.5em;
                  `} />
                  })}
                </div>
              </div>
            })
          }
          <Link href='/books/new'><span>new Book</span></Link>
        </div>
      </div>
    </Layout>
  )
}

export default withRouter(Mypage)
