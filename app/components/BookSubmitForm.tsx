/** @jsx jsx */
import { IconUpload, useToast } from 'sancho'
import { jsx, css } from '@emotion/core'
import Book from '../utils/book'
import { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import Loader from './Loader'
import { useDropzone } from 'react-dropzone'

interface Props {
  book: Book
}

const BookSubmitForm: React.FC<Props> = ({ book }) => {
  const toast = useToast()
  const [isLoading, setLoading] = useState(true)
  const [isUploading, setUploading] = useState(false)
  const [submission, setSubmission] = useState()

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDropAccepted: async files => {
      setUploading(true)
      const storageRef = firebase.storage().ref()
      const ref = storageRef.child(`/submissions/${book!.id}/${Date.now()}`)
      const originalName = files[0].name
      console.log('begin upload', originalName, files[0])

      await ref.put(files[0], {
        customMetadata: { originalName }
      })
      setUploading(false)

      setSubmission({ ...submission, originalName })
      toast({
        title: '見本誌をアップロードしました',
        intent: 'success'
      })
    },
    onDropRejected: () => {
      alert('画像アップロードに失敗しました')
    },
    maxSize: 1000 * 1000 * 1,
    disabled: isUploading
  })

  useEffect(() => {
    const id = book!.id
    const db: firebase.firestore.Firestore = firebase.firestore()
    db.collection('bookSubmissions')
      .doc(id)
      .get()
      .then(docSnapshot => {
        setLoading(false)
        if (docSnapshot.exists) {
          console.log(docSnapshot.data())
          setSubmission(docSnapshot.data())
        }
      })
  }, [])

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
          `
        })}
      >
        {isUploading && <Loader label="Uploading..." />}

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
