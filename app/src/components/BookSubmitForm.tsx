/** @jsx jsx */
import { IconUpload } from 'sancho'
import { jsx, css } from '@emotion/core'
import Book from '../utils/book'
import { useState, useEffect } from 'react'
import Loader from './Loader'
import { useDropzone } from 'react-dropzone'
import { firebase, db } from '../utils/firebase'
import { useToast } from './Toast'

interface Props {
  book: Book
}

const useSubmission = (bookId: string) => {
  const [isLoading, setLoading] = useState(true)
  const [submission, setSubmission] = useState<any>()
  useEffect(() => {
    setLoading(true)
    db.collection('bookSubmissions')
      .doc(bookId)
      .get()
      .then((snapshot) => {
        setLoading(false)
        if (snapshot.exists) {
          console.log(snapshot.data())
          setSubmission({
            ...snapshot.data(),
            id: snapshot.id,
          })
        }
      })
  }, [bookId])
  return {
    isLoading,
    submission,
    setSubmission,
  }
}

const BookSubmitForm: React.FC<Props> = ({ book }) => {
  const toast = useToast()
  const [isUploading, setUploading] = useState(false)
  const { submission, isLoading, setSubmission } = useSubmission(book.id!)

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDropAccepted: async (files) => {
      setUploading(true)
      const storageRef = firebase.storage().ref()
      const originalName = files[0].name
      const ref = storageRef.child(
        `/submissions/${book!.id}/${Date.now()}-${originalName}`,
      )
      console.log('begin upload', originalName, files[0])

      await ref.put(files[0], {
        customMetadata: { originalName },
      })

      const unsubscribe = db
        .collection('bookSubmissions')
        .doc(book!.id)
        .onSnapshot((snapshot) => {
          if (!snapshot.exists) return
          const { createdAt } = snapshot.data()!
          if (
            !submission ||
            createdAt.seconds !== submission.createdAt.seconds
          ) {
            console.log('========UPLOADED=========', originalName)
            setUploading(false)
            setSubmission({ ...submission, originalName })
            unsubscribe()
            toast({
              title: '見本誌をアップロードしました',
              intent: 'success',
            })
          }
        })
    },
    onDropRejected: () => {
      alert('アップロードに失敗しました')
    },
    maxSize: 1000 * 1000 * 100,
    disabled: isUploading,
  })

  if (isLoading) {
    return <Loader />
  }

  return (
    <section>
      {submission ? (
        <p>
          <b>アップロード済み</b> {submission.originalName}
        </p>
      ) : (
        <p>
          <b>未アップロード</b>
        </p>
      )}
      <div
        {...getRootProps({
          css: css`
            background-color: #e5e5e5;
            min-width: 180px;
            width: 180px;
            height: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
          `,
        })}>
        {isUploading && <Loader />}

        {!isUploading && (
          <>
            <input {...getInputProps()} />
            <IconUpload size="xl" />
          </>
        )}
      </div>
    </section>
  )
}

export default BookSubmitForm
